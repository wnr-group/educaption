import { useMemo, useCallback } from 'react'
import { useGroups } from './queries/useGroups'
import { useAdmissionBodies } from './queries/useAdmissionBodies'
import { useCategories } from './queries/useCategories'
import { useCourses } from './queries/useCourses'
import { useSubjectLists } from './queries/useSubjectLists'
import { calculateCourseCutoffs, validateMarks } from '../lib/calculator'

/**
 * Custom hook for cutoff calculator functionality
 * Provides data fetching, calculations, and validation
 */
export function useCalculator() {
  // Fetch required data
  const { data: groups = [], isLoading: groupsLoading, error: groupsError } = useGroups()
  const { data: admissionBodies = [], isLoading: bodiesLoading, error: bodiesError } = useAdmissionBodies()
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useCourses()
  const { data: subjectLists = [], isLoading: listsLoading, error: listsError } = useSubjectLists()

  // Combined loading and error states
  const isLoading = groupsLoading || bodiesLoading || categoriesLoading || coursesLoading || listsLoading
  const error = groupsError || bodiesError || categoriesError || coursesError || listsError

  /**
   * Get a group by its ID
   */
  const getGroupById = useCallback((groupId) => {
    return groups.find(g => g.id === groupId) || null
  }, [groups])

  /**
   * Get a group by its code (e.g., "1", "2")
   */
  const getGroupByCode = useCallback((groupCode) => {
    return groups.find(g => g.code === groupCode) || null
  }, [groups])

  /**
   * Get subjects for a selected group (English - used as keys)
   */
  const getSubjectsForGroup = useCallback((groupId) => {
    const group = getGroupById(groupId)
    return group?.subjects || []
  }, [getGroupById])

  /**
   * Get translated subjects for a selected group
   * @param {string} groupId - Group ID
   * @param {string} language - Current language ('en' or 'ta')
   * @returns {Array} Array of subject names in requested language
   */
  const getTranslatedSubjectsForGroup = useCallback((groupId, language) => {
    const group = getGroupById(groupId)
    if (!group) return []

    if (language === 'ta' && group.subjects_ta?.length) {
      return group.subjects_ta
    }
    return group.subjects || []
  }, [getGroupById])

  /**
   * Calculate cutoffs for all eligible courses
   */
  const calculateCutoffs = useCallback((groupId, marks) => {
    const group = getGroupById(groupId)
    if (!group) return []

    return calculateCourseCutoffs(courses, admissionBodies, group, marks, subjectLists)
  }, [getGroupById, courses, admissionBodies, subjectLists])

  /**
   * Get eligible courses based on calculated cutoffs
   * Note: course.admission_body_id is the name (e.g., "TNEA"), not the Airtable record ID
   */
  const getEligibleCourses = useCallback((cutoffResults) => {
    const eligibleBodyNames = cutoffResults.map(r => r.admissionBodyName)
    return courses.filter(course =>
      eligibleBodyNames.includes(course.admission_body_id)
    )
  }, [courses])

  /**
   * Validate marks for a given group
   */
  const validateGroupMarks = useCallback((groupId, marks) => {
    const subjects = getSubjectsForGroup(groupId)
    return validateMarks(marks, subjects)
  }, [getSubjectsForGroup])

  /**
   * Format group options for select dropdown
   */
  const groupOptions = useMemo(() => {
    return groups.map(group => ({
      value: group.id,
      label: `Group ${group.code} - ${group.name}`
    }))
  }, [groups])

  /**
   * Format category options for select dropdown
   */
  const categoryOptions = useMemo(() => {
    return categories.map(category => ({
      value: category.id,
      label: `${category.code} - ${category.name}`
    }))
  }, [categories])

  /**
   * Group courses by admission body for display
   * Note: course.admission_body_id is the name (e.g., "TNEA"), not the Airtable record ID
   */
  const coursesByAdmissionBody = useMemo(() => {
    const grouped = {}

    courses.forEach(course => {
      const bodyName = course.admission_body_id
      if (!bodyName) return

      if (!grouped[bodyName]) {
        const body = admissionBodies.find(b => b.name === bodyName)
        grouped[bodyName] = {
          admissionBody: body,
          courses: []
        }
      }
      grouped[bodyName].courses.push(course)
    })

    return Object.values(grouped).filter(g => g.admissionBody)
  }, [courses, admissionBodies])

  /**
   * Group eligible courses by category for results display
   * @param {Array} eligibleCourses - Courses the student is eligible for
   * @param {Array} cutoffResults - Calculated cutoffs by admission body
   * @returns {Array} Courses grouped by category with cutoff info
   */
  const groupCoursesByCategory = useCallback((eligibleCourses, cutoffResults) => {
    const categoryMap = {}

    eligibleCourses.forEach(course => {
      const body = admissionBodies.find(b => b.name === course.admission_body_id)
      if (!body) return

      const category = body.category || 'Other'
      const cutoffResult = cutoffResults.find(r => r.admissionBodyName === body.name)

      if (!categoryMap[category]) {
        categoryMap[category] = {
          category,
          courses: [],
          cutoff: cutoffResult?.cutoff || 0,
          maxCutoff: cutoffResult?.maxCutoff || 200,
          formula: cutoffResult?.formula || body.default_formula || null
        }
      }

      categoryMap[category].courses.push({
        ...course,
        admissionBodyName: body.name,
        cutoff: cutoffResult?.cutoff || 0
      })

      // Update category cutoff to highest among its courses
      if (cutoffResult && cutoffResult.cutoff > categoryMap[category].cutoff) {
        categoryMap[category].cutoff = cutoffResult.cutoff
        categoryMap[category].maxCutoff = cutoffResult.maxCutoff
      }
    })

    // Sort categories by cutoff (highest first) and filter out 0 cutoffs (formula couldn't be calculated)
    return Object.values(categoryMap)
      .filter(cat => cat.cutoff > 0)
      .sort((a, b) => b.cutoff - a.cutoff)
  }, [admissionBodies])

  return {
    // Data
    groups,
    admissionBodies,
    categories,
    courses,
    subjectLists,

    // Loading and error states
    isLoading,
    error,

    // Formatted options for dropdowns
    groupOptions,
    categoryOptions,
    coursesByAdmissionBody,

    // Utility functions
    getGroupById,
    getGroupByCode,
    getSubjectsForGroup,
    getTranslatedSubjectsForGroup,
    calculateCutoffs,
    getEligibleCourses,
    validateGroupMarks,
    groupCoursesByCategory
  }
}

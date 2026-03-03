import { useMemo, useCallback } from 'react'
import { useGroups } from './queries/useGroups'
import { useStreams } from './queries/useStreams'
import { useCategories } from './queries/useCategories'
import { useCourses } from './queries/useCourses'
import {
  calculateStreamCutoffs,
  filterEligibleCourses,
  validateMarks
} from '../lib/calculator'

/**
 * Custom hook for cutoff calculator functionality
 * Provides data fetching, calculations, and validation
 */
export function useCalculator() {
  // Fetch required data
  const { data: groups = [], isLoading: groupsLoading, error: groupsError } = useGroups()
  const { data: streams = [], isLoading: streamsLoading, error: streamsError } = useStreams()
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useCourses()

  // Combined loading and error states
  const isLoading = groupsLoading || streamsLoading || categoriesLoading || coursesLoading
  const error = groupsError || streamsError || categoriesError || coursesError

  /**
   * Get a group by its ID
   */
  const getGroupById = useCallback((groupId) => {
    return groups.find(g => g.id === groupId) || null
  }, [groups])

  /**
   * Get subjects for a selected group
   */
  const getSubjectsForGroup = useCallback((groupId) => {
    const group = getGroupById(groupId)
    return group?.subjects || []
  }, [getGroupById])

  /**
   * Calculate cutoffs for all eligible streams
   */
  const calculateCutoffs = useCallback((groupId, marks) => {
    const group = getGroupById(groupId)
    if (!group) return []

    return calculateStreamCutoffs(streams, group, marks)
  }, [getGroupById, streams])

  /**
   * Get eligible courses based on calculated stream cutoffs
   */
  const getEligibleCourses = useCallback((streamCutoffs) => {
    const eligibleStreamIds = streamCutoffs.map(s => s.streamId)
    return filterEligibleCourses(courses, eligibleStreamIds)
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

  return {
    // Data
    groups,
    streams,
    categories,
    courses,

    // Loading and error states
    isLoading,
    error,

    // Formatted options for dropdowns
    groupOptions,
    categoryOptions,

    // Utility functions
    getGroupById,
    getSubjectsForGroup,
    calculateCutoffs,
    getEligibleCourses,
    validateGroupMarks
  }
}

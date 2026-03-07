/**
 * Tamil Nadu 12th Standard Cutoff Calculator
 *
 * Implements correct formulas for:
 * - TNEA (Engineering): M + P/2 + C/2
 * - TNDALU (Law): (S3 + S4 + S5 + S6) / 4
 * - TANUVAS (Veterinary): B + P/2 + C/2 or B/2 + P/2 + C/2 + M/2
 * - TNAU (Agriculture): Various formulas with subject lists
 * - TNJFU (Fisheries): B + P/2 + C/2
 * - Paramedical: B + P/2 + C/2
 */

/**
 * Subject code mapping for formula parsing
 */
const SUBJECT_CODE_MAP = {
  'M': ['Mathematics', 'Maths', 'MATHEMATICS', 'MATHS', 'Business Mathematics'],
  'P': ['Physics', 'PHYSICS'],
  'C': ['Chemistry', 'CHEMISTRY'],
  'B': ['Biology', 'BIOLOGY'],
  'BOT': ['Botany', 'BOTANY'],
  'ZOO': ['Zoology', 'ZOOLOGY'],
  'CS': ['Computer Science', 'COMPUTER SCIENCE', 'Computer Applications'],
  'IT': ['Information Technology', 'INFORMATION TECHNOLOGY'],
  'IP': ['Informatics Practices', 'INFORMATICS PRACTICES'],
  'A': ['Accountancy', 'ACCOUNTANCY', 'Accounts'],
  'E': ['Economics', 'ECONOMICS'],
  'CO': ['Commerce', 'COMMERCE'],
  'H': ['History', 'HISTORY'],
  'G': ['Geography', 'GEOGRAPHY'],
  'PS': ['Political Science', 'POLITICAL SCIENCE'],
  'SO': ['Sociology', 'SOCIOLOGY']
}

/**
 * Gets subject code from subject name
 * @param {string} subjectName - The name of the subject
 * @returns {string} The subject code
 */
function getSubjectCode(subjectName) {
  const normalized = subjectName.trim().toLowerCase()

  for (const [code, names] of Object.entries(SUBJECT_CODE_MAP)) {
    if (names.some(name => name.toLowerCase() === normalized)) {
      return code
    }
  }

  // Return first letter as fallback
  return subjectName.charAt(0).toUpperCase()
}

/**
 * Creates marks lookup from subjects array and marks object
 * Handles special cases like Botany+Zoology = Biology average
 * Also creates positional codes (S1-S6) for TNDALU formula
 *
 * @param {Array<string>} subjects - Array of subject names
 * @param {Object} marks - Object with subject names as keys and marks as values
 * @returns {Object} Object with subject codes as keys and marks as values
 */
function createMarksLookup(subjects, marks) {
  const lookup = {}

  // Map each subject to its code
  subjects.forEach((subject, index) => {
    const code = getSubjectCode(subject)
    const mark = parseFloat(marks[subject]) || 0
    lookup[code] = mark

    // Also add positional codes for TNDALU formula (S1 through S6)
    // S1 and S2 are language subjects, S3-S6 are the 4 main subjects
    lookup[`S${index + 1}`] = mark
  })

  // Handle Biology = Botany + Zoology average if both present but B is not
  if (lookup['BOT'] !== undefined && lookup['ZOO'] !== undefined && lookup['B'] === undefined) {
    lookup['B'] = (lookup['BOT'] + lookup['ZOO']) / 2
  }

  // If Biology exists, also set BOT and ZOO to same value (for P/2 + C/2 + BOT/2 + ZOO/2 formulas)
  if (lookup['B'] !== undefined && lookup['BOT'] === undefined) {
    lookup['BOT'] = lookup['B']
    lookup['ZOO'] = lookup['B']
  }

  return lookup
}

/**
 * Resolves subject list placeholder in formula (LIST_A, LIST_B, etc.)
 * Finds the matching subject from the list that the student has
 *
 * @param {string} formula - Formula with LIST_X placeholder
 * @param {Object} marks - Marks lookup
 * @param {Array<string>} subjectListSubjects - Subjects in the list
 * @returns {string} Formula with LIST_X replaced by actual mark
 */
function resolveSubjectList(formula, marks, subjectListSubjects) {
  const listMatch = formula.match(/LIST_[A-E]/i)
  if (!listMatch || !subjectListSubjects || subjectListSubjects.length === 0) {
    return formula
  }

  // Find which subject from the list the student has
  let listSubjectMark = 0
  for (const subject of subjectListSubjects) {
    const code = getSubjectCode(subject)
    if (marks[code] !== undefined && marks[code] > 0) {
      listSubjectMark = marks[code]
      break
    }
  }

  return formula.replace(/LIST_[A-E]/gi, listSubjectMark.toString())
}

/**
 * Handles special AVG formula (average of all subjects)
 * Used for B.Voc courses
 *
 * @param {string} formula - Formula string
 * @param {Object} marks - Marks lookup
 * @returns {string|number} Modified formula or calculated average
 */
function handleAvgFormula(formula, marks) {
  if (formula.trim().toUpperCase() === 'AVG') {
    const values = Object.values(marks).filter(v => typeof v === 'number' && v > 0)
    if (values.length === 0) return 0
    return values.reduce((a, b) => a + b, 0) / values.length
  }
  return formula
}

/**
 * Calculates cutoff using formula string
 *
 * @param {string} formula - Formula like "M + P/2 + C/2"
 * @param {Object} marks - Marks lookup with subject codes as keys
 * @param {Array<string>} subjectListSubjects - Optional subject list for TNAU courses
 * @returns {number} Calculated cutoff rounded to 2 decimals
 */
export function calculateCutoff(formula, marks, subjectListSubjects = null) {
  if (!formula || typeof formula !== 'string') return 0

  // Handle AVG formula
  const avgResult = handleAvgFormula(formula, marks)
  if (typeof avgResult === 'number') {
    return Math.round(avgResult * 100) / 100
  }

  let expression = formula.toUpperCase()

  // Resolve subject list if present
  if (subjectListSubjects) {
    expression = resolveSubjectList(expression, marks, subjectListSubjects)
  }

  // Sort codes by length (longest first) to avoid partial replacements
  // e.g., replace 'BOT' before 'B'
  const codes = Object.keys(marks).sort((a, b) => b.length - a.length)

  for (const code of codes) {
    const value = marks[code] || 0
    // Use word boundary to avoid partial matches
    const regex = new RegExp(`\\b${code}\\b`, 'g')
    expression = expression.replace(regex, value.toString())
  }

  // Validate expression only contains numbers and math operators
  if (!/^[\d\s+\-*/().]+$/.test(expression)) {
    console.warn('Invalid formula expression:', expression, 'Original:', formula)
    return 0
  }

  try {
    const result = new Function(`return ${expression}`)()
    return Math.round(result * 100) / 100
  } catch (error) {
    console.error('Error calculating cutoff:', error, 'Expression:', expression)
    return 0
  }
}

/**
 * Calculates cutoffs for all eligible courses based on group
 *
 * @param {Array<Object>} courses - Courses with admission body and formula
 * @param {Array<Object>} admissionBodies - Admission bodies with default formulas
 * @param {Object} group - Selected group with code and subjects
 * @param {Object} marks - Subject marks (subject name as key)
 * @param {Array<Object>} subjectLists - Subject lists for TNAU courses
 * @returns {Array<Object>} Calculated cutoffs per admission body
 */
export function calculateCourseCutoffs(courses, admissionBodies, group, marks, subjectLists = []) {
  if (!courses || !admissionBodies || !group || !marks) return []

  const marksLookup = createMarksLookup(group.subjects || [], marks)

  // Create lookup by name (Admission_Body in Airtable is a text field with name like "TNDALU")
  const bodyLookupByName = {}
  admissionBodies.forEach(body => {
    bodyLookupByName[body.name] = body
  })

  const listLookup = {}
  subjectLists.forEach(list => {
    listLookup[list.id] = list.subjects
    listLookup[list.name] = list.subjects
  })

  // Group results by admission body
  const resultsByBody = {}

  for (const course of courses) {
    // Eligible_Groups is text like "1, 2, 4" - match against group.code
    const groupCode = String(group.code)
    const isEligible = course.eligible_groups?.includes(groupCode)

    if (!isEligible) continue

    // Admission_Body is a text field with the name (e.g., "TNDALU")
    const admissionBody = bodyLookupByName[course.admission_body_id]

    if (!admissionBody) {
      console.log('No admission body match for:', course.admission_body_id)
      continue
    }

    // Use course formula override or admission body default
    const formula = course.formula_override || admissionBody.default_formula
    if (!formula) continue

    // Get subject list if course uses one
    const subjectListSubjects = course.subject_list_id
      ? listLookup[course.subject_list_id]
      : null

    const cutoff = calculateCutoff(formula, marksLookup, subjectListSubjects)

    // Group by admission body for cleaner display
    if (!resultsByBody[admissionBody.id]) {
      resultsByBody[admissionBody.id] = {
        admissionBodyId: admissionBody.id,
        admissionBodyName: admissionBody.name,
        admissionBodyNameTa: admissionBody.name_ta,
        formula: admissionBody.default_formula,
        cutoff,
        maxCutoff: admissionBody.max_cutoff || 200,
        courses: []
      }
    }

    resultsByBody[admissionBody.id].courses.push({
      courseId: course.id,
      courseName: course.name,
      courseNameTa: course.name_ta,
      formula: course.formula_override || null,
      duration: course.duration
    })
  }

  // Convert to array and sort by cutoff (highest first)
  return Object.values(resultsByBody).sort((a, b) => b.cutoff - a.cutoff)
}

/**
 * Legacy function for backwards compatibility
 * Maps to calculateCourseCutoffs
 */
export function calculateStreamCutoffs(streams, group, marks) {
  // Convert streams to admission bodies format
  const admissionBodies = streams.map(s => ({
    id: s.id,
    name: s.name,
    name_ta: s.name_ta,
    default_formula: s.formula,
    max_cutoff: s.max_cutoff
  }))

  // Create dummy courses (one per stream)
  const courses = streams.map(s => ({
    id: s.id,
    name: s.name,
    name_ta: s.name_ta,
    admission_body_id: s.id,
    eligible_groups: s.eligible_groups?.map(g => g) || [group.code]
  }))

  return calculateCourseCutoffs(courses, admissionBodies, group, marks)
}

/**
 * Filters courses based on eligible admission body IDs
 */
export function filterEligibleCourses(courses, eligibleBodyIds) {
  if (!courses || !eligibleBodyIds || eligibleBodyIds.length === 0) {
    return []
  }

  return courses.filter(course =>
    eligibleBodyIds.includes(course.admission_body_id)
  )
}

/**
 * Parse formula and return breakdown of each component's contribution
 * @param {string} formula - Formula like "M + P/2 + C/2"
 * @param {Object} marks - Marks lookup with subject codes as keys
 * @returns {Array} Array of { subject, mark, weight, contribution }
 */
export function getFormulaBreakdown(formula, marks) {
  if (!formula || typeof formula !== 'string') return []

  // Handle special formulas
  if (formula.trim().toUpperCase() === 'AVG') {
    const validMarks = Object.entries(marks).filter(([k, v]) =>
      typeof v === 'number' && v > 0 && !k.startsWith('S')
    )
    const avg = validMarks.reduce((sum, [, v]) => sum + v, 0) / validMarks.length
    return [{
      label: 'Average of all subjects',
      mark: avg.toFixed(1),
      weight: '1',
      contribution: avg
    }]
  }

  const breakdown = []
  const subjectNames = {
    'M': 'Mathematics',
    'P': 'Physics',
    'C': 'Chemistry',
    'B': 'Biology',
    'BOT': 'Botany',
    'ZOO': 'Zoology',
    'CS': 'Computer Science',
    'S3': 'Subject 3',
    'S4': 'Subject 4',
    'S5': 'Subject 5',
    'S6': 'Subject 6'
  }

  // Parse formula components like "M + P/2 + C/2" or "(S3 + S4 + S5 + S6) / 4"
  const upperFormula = formula.toUpperCase()

  // Check for average formula pattern (S3 + S4 + S5 + S6) / 4
  if (upperFormula.includes('S3') && upperFormula.includes('S4')) {
    const subjects = ['S3', 'S4', 'S5', 'S6']
    subjects.forEach(code => {
      const mark = marks[code] || 0
      breakdown.push({
        label: subjectNames[code] || code,
        mark: mark,
        weight: '÷4',
        contribution: mark / 4
      })
    })
    return breakdown
  }

  // Parse individual terms like "M", "P/2", "C/2", "B/2"
  const termRegex = /([A-Z]+)(?:\/(\d+))?/g
  let match

  while ((match = termRegex.exec(upperFormula)) !== null) {
    const code = match[1]
    const divisor = match[2] ? parseInt(match[2]) : 1

    // Skip LIST_ placeholders and positional codes
    if (code.startsWith('LIST') || (code.startsWith('S') && code.length === 2)) continue

    const mark = marks[code] || 0
    const contribution = mark / divisor

    breakdown.push({
      label: subjectNames[code] || code,
      mark: mark,
      weight: divisor > 1 ? `÷${divisor}` : '×1',
      contribution: contribution
    })
  }

  return breakdown
}

/**
 * Validates marks input
 * @param {Object} marks - Object with subject names as keys and marks as values
 * @param {Array<string>} subjects - Required subject names
 * @returns {Object} Validation result with isValid and errors
 */
export function validateMarks(marks, subjects) {
  const errors = {}

  for (const subject of subjects) {
    const mark = marks[subject]

    if (mark === undefined || mark === '' || mark === null) {
      errors[subject] = 'Mark is required'
    } else {
      const numMark = parseFloat(mark)
      if (isNaN(numMark)) {
        errors[subject] = 'Must be a number'
      } else if (numMark < 0) {
        errors[subject] = 'Cannot be negative'
      } else if (numMark > 100) {
        errors[subject] = 'Cannot exceed 100'
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

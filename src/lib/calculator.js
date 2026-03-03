/**
 * Subject code mapping for formula parsing
 * Maps formula variables to standard subject identifiers
 */
const SUBJECT_CODE_MAP = {
  'M': ['Mathematics', 'Maths', 'MATHEMATICS', 'MATHS'],
  'P': ['Physics', 'PHYSICS'],
  'C': ['Chemistry', 'CHEMISTRY'],
  'B': ['Biology', 'BIOLOGY', 'Botany', 'BOTANY', 'Zoology', 'ZOOLOGY'],
  'CS': ['Computer Science', 'COMPUTER SCIENCE', 'ComputerScience'],
  'A': ['Accountancy', 'ACCOUNTANCY', 'Accounts'],
  'E': ['Economics', 'ECONOMICS'],
  'CO': ['Commerce', 'COMMERCE']
}

/**
 * Finds the subject code (M, P, C, B, etc.) for a given subject name
 * @param {string} subjectName - The name of the subject
 * @returns {string|null} The subject code or null if not found
 */
function getSubjectCode(subjectName) {
  const normalizedName = subjectName.trim()

  for (const [code, names] of Object.entries(SUBJECT_CODE_MAP)) {
    if (names.some(name =>
      name.toLowerCase() === normalizedName.toLowerCase()
    )) {
      return code
    }
  }

  // Return first letter as fallback
  return normalizedName.charAt(0).toUpperCase()
}

/**
 * Creates a marks lookup object from subjects and their marks
 * @param {Array<string>} subjects - Array of subject names
 * @param {Object} marks - Object with subject names as keys and marks as values
 * @returns {Object} Object with subject codes as keys and marks as values
 */
function createMarksLookup(subjects, marks) {
  const lookup = {}

  for (const subject of subjects) {
    const code = getSubjectCode(subject)
    const mark = marks[subject] || 0
    lookup[code] = parseFloat(mark) || 0
  }

  return lookup
}

/**
 * Calculates cutoff using a formula string
 * @param {string} formula - Formula like "M/2 + P/4 + C/4"
 * @param {Object} marks - Object with subject codes as keys and marks as values
 * @returns {number} Calculated cutoff value rounded to 2 decimal places
 */
export function calculateCutoff(formula, marks) {
  if (!formula || typeof formula !== 'string') {
    return 0
  }

  // Replace subject codes with their values
  let expression = formula.toUpperCase()

  // Sort codes by length (longest first) to avoid partial replacements
  const codes = Object.keys(marks).sort((a, b) => b.length - a.length)

  for (const code of codes) {
    const value = marks[code] || 0
    // Use word boundary to avoid partial matches
    const regex = new RegExp(`\\b${code}\\b`, 'g')
    expression = expression.replace(regex, value.toString())
  }

  // Validate the expression only contains numbers and math operators
  if (!/^[\d\s+\-*/().]+$/.test(expression)) {
    console.warn('Invalid formula expression:', expression)
    return 0
  }

  try {
    // Safe evaluation using Function constructor
    const result = new Function(`return ${expression}`)()
    return Math.round(result * 100) / 100
  } catch (error) {
    console.error('Error calculating cutoff:', error)
    return 0
  }
}

/**
 * Calculates cutoff for all eligible streams based on the selected group
 * @param {Array<Object>} streams - Array of stream objects with formula and eligible_groups
 * @param {Object} group - The selected group object with id and subjects
 * @param {Object} marks - Object with subject names as keys and marks as values
 * @returns {Array<Object>} Array of objects with stream info and calculated cutoff
 */
export function calculateStreamCutoffs(streams, group, marks) {
  if (!streams || !group || !marks) {
    return []
  }

  const marksLookup = createMarksLookup(group.subjects || [], marks)
  const results = []

  for (const stream of streams) {
    // Check if the group is eligible for this stream
    const eligibleGroups = stream.eligible_groups || []
    const isEligible = eligibleGroups.includes(group.id)

    if (isEligible && stream.formula) {
      const cutoff = calculateCutoff(stream.formula, marksLookup)

      results.push({
        streamId: stream.id,
        streamName: stream.name,
        streamNameTa: stream.name_ta,
        formula: stream.formula,
        cutoff,
        maxCutoff: stream.max_cutoff || 200
      })
    }
  }

  // Sort by cutoff value (highest first)
  return results.sort((a, b) => b.cutoff - a.cutoff)
}

/**
 * Filters courses based on eligible stream IDs
 * @param {Array<Object>} courses - Array of course objects with stream_id
 * @param {Array<string>} eligibleStreamIds - Array of eligible stream UUIDs
 * @returns {Array<Object>} Filtered array of eligible courses
 */
export function filterEligibleCourses(courses, eligibleStreamIds) {
  if (!courses || !eligibleStreamIds || eligibleStreamIds.length === 0) {
    return []
  }

  return courses.filter(course =>
    eligibleStreamIds.includes(course.stream_id)
  )
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

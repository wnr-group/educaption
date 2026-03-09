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
 * Maps short codes to possible subject names
 */
const SUBJECT_CODE_MAP = {
  'M': ['Mathematics', 'Maths', 'MATHEMATICS', 'MATHS', 'Business Mathematics', 'Business Mathematics & Statistics'],
  'P': ['Physics', 'PHYSICS'],
  'C': ['Chemistry', 'CHEMISTRY'],
  'B': ['Biology', 'BIOLOGY'],
  'BOT': ['Botany', 'BOTANY'],
  'ZOO': ['Zoology', 'ZOOLOGY'],
  'CS': ['Computer Science', 'COMPUTER SCIENCE', 'Computer Applications', 'Computer Technology', 'Computer Application'],
  'IT': ['Information Technology', 'INFORMATION TECHNOLOGY'],
  'IP': ['Informatics Practices', 'INFORMATICS PRACTICES'],
  'A': ['Accountancy', 'ACCOUNTANCY', 'Accounts', 'Accountancy - Theory'],
  'E': ['Economics', 'ECONOMICS'],
  'CO': ['Commerce', 'COMMERCE'],
  'H': ['History', 'HISTORY'],
  'G': ['Geography', 'GEOGRAPHY'],
  'PS': ['Political Science', 'POLITICAL SCIENCE'],
  'SO': ['Sociology', 'SOCIOLOGY'],
  'HS': ['Home Science', 'HOME SCIENCE'],
  'BC': ['Bio-Chemistry', 'BIO-CHEMISTRY', 'Biochemistry'],
  'MB': ['Micro-Biology', 'MICRO-BIOLOGY', 'Microbiology'],
  'ST': ['Statistics', 'STATISTICS'],
  'ND': ['Nutrition and Dietetics', 'Nutrition & Dietetics', 'NUTRITION AND DIETETICS']
}

/**
 * Maps full subject names in formulas to codes
 * Used to parse formulas like "Biology/2 + Physics/2 + Chemistry/2"
 */
const FORMULA_SUBJECT_MAP = {
  'MATHS': 'M',
  'MATHEMATICS': 'M',
  'PHYSICS': 'P',
  'CHEMISTRY': 'C',
  'BIOLOGY': 'B',
  'BOTANY': 'BOT',
  'ZOOLOGY': 'ZOO',
  'COMPUTER TECH': 'CS',
  'THEORY': 'THEORY',
  'PRACTICAL': 'PRACTICAL'
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
 * Also creates positional codes (S1-S6) for formulas
 * S1, S2 = Language subjects
 * S3-S6 = Group subjects
 *
 * @param {Array<string>} subjects - Array of group subject names (4 subjects)
 * @param {Object} marks - Object with subject names as keys and marks as values
 * @returns {Object} Object with subject codes as keys and marks as values
 */
function createMarksLookup(subjects, marks) {
  const lookup = {}

  // Language subjects are always S1 and S2
  const lang1Mark = parseFloat(marks['Language 1']) || 0
  const lang2Mark = parseFloat(marks['Language 2']) || 0
  lookup['S1'] = lang1Mark
  lookup['S2'] = lang2Mark

  // Map each group subject to its code and positional code (S3-S6)
  subjects.forEach((subject, index) => {
    const code = getSubjectCode(subject)
    const mark = parseFloat(marks[subject]) || 0
    lookup[code] = mark

    // S3 through S6 for the 4 group subjects
    lookup[`S${index + 3}`] = mark

    // Handle vocational subjects - detect theory/practical
    const subjectLower = subject.toLowerCase()
    if (subjectLower.includes('theory')) {
      lookup['THEORY'] = mark
    }
    if (subjectLower.includes('practical')) {
      lookup['PRACTICAL'] = mark
    }
    if (subjectLower.includes('computer tech') || subjectLower.includes('computer technology')) {
      lookup['CS'] = mark
    }
  })

  // Handle Biology = Botany + Zoology average if both present but B is not
  if (lookup['BOT'] !== undefined && lookup['ZOO'] !== undefined && lookup['B'] === undefined) {
    lookup['B'] = (lookup['BOT'] + lookup['ZOO']) / 2
  }

  // If Biology exists, also set BOT and ZOO to same value (for formulas using both)
  if (lookup['B'] !== undefined && lookup['BOT'] === undefined) {
    lookup['BOT'] = lookup['B']
    lookup['ZOO'] = lookup['B']
  }

  return lookup
}

/**
 * Resolves subject list placeholder in formula (LIST_A, LIST_B, etc.)
 * Finds the matching subject from the list that the student has
 * For LIST_F: Priority is Biology first, then Mathematics
 *
 * @param {string} formula - Formula with LIST_X placeholder
 * @param {Object} marks - Marks lookup
 * @param {Array<string>} subjectListSubjects - Subjects in the list
 * @returns {string|null} Formula with LIST_X replaced by actual mark, or null if student has no subject from the list
 */
function resolveSubjectList(formula, marks, subjectListSubjects) {
  const listMatch = formula.match(/LIST_[A-F]/i)
  if (!listMatch || !subjectListSubjects || subjectListSubjects.length === 0) {
    return formula
  }

  // Find which subject from the list the student has
  // LIST_F has priority: Biology first, then Mathematics
  let listSubjectMark = null
  for (const subject of subjectListSubjects) {
    const code = getSubjectCode(subject)
    if (marks[code] !== undefined && marks[code] > 0) {
      listSubjectMark = marks[code]
      break
    }
  }

  // If student has no subject from the required list, return null to signal ineligibility
  if (listSubjectMark === null) {
    return null
  }

  return formula.replace(/LIST_[A-F]/gi, listSubjectMark.toString())
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
 * Normalizes formula by replacing full subject names with codes
 * e.g., "Biology/2 + Physics/2" -> "B/2 + P/2"
 *
 * @param {string} formula - Formula string
 * @returns {string} Normalized formula with subject codes
 */
function normalizeFormula(formula) {
  let normalized = formula.toUpperCase()

  // Replace full subject names with codes (longest first to avoid partial matches)
  const sortedSubjects = Object.keys(FORMULA_SUBJECT_MAP).sort((a, b) => b.length - a.length)
  for (const subject of sortedSubjects) {
    const code = FORMULA_SUBJECT_MAP[subject]
    normalized = normalized.replace(new RegExp(subject, 'g'), code)
  }

  return normalized
}

/**
 * Calculates cutoff using formula string
 *
 * @param {string} formula - Formula like "M + P/2 + C/2" or "Biology/2 + Physics/2 + Chemistry/2"
 * @param {Object} marks - Marks lookup with subject codes as keys
 * @param {Array<string>} subjectListSubjects - Optional subject list for TNAU courses
 * @returns {number|null} Calculated cutoff rounded to 2 decimals, or null if ineligible (missing required subject)
 */
export function calculateCutoff(formula, marks, subjectListSubjects = null) {
  if (!formula || typeof formula !== 'string') return 0

  // Handle AVG formula
  const avgResult = handleAvgFormula(formula, marks)
  if (typeof avgResult === 'number') {
    return Math.round(avgResult * 100) / 100
  }

  // Normalize formula (convert full subject names to codes)
  let expression = normalizeFormula(formula)

  // Resolve subject list if present
  if (subjectListSubjects) {
    expression = resolveSubjectList(expression, marks, subjectListSubjects)
    // If student has no subject from the required list, they're ineligible
    if (expression === null) {
      return null
    }
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
    // Eligible_Groups can be array (from hook) or text "SCI-1, SCI-2, VOC-7" - match against group.code
    const groupCode = String(group.code)
    // Handle both array and string formats
    let eligibleGroupsArray = []
    if (Array.isArray(course.eligible_groups)) {
      eligibleGroupsArray = course.eligible_groups
    } else if (typeof course.eligible_groups === 'string') {
      eligibleGroupsArray = course.eligible_groups.split(',').map(g => g.trim())
    }
    const isEligible = eligibleGroupsArray.includes(groupCode)

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

    // If cutoff is null, student is ineligible (missing required subject from list)
    if (cutoff === null) continue

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
 * @param {string} formula - Formula like "M + P/2 + C/2" or "Biology/2 + Physics/2"
 * @param {Object} marks - Marks lookup with subject codes as keys
 * @param {Object} customSubjectNames - Optional mapping of codes to custom subject names
 * @returns {Array} Array of { subject, mark, weight, contribution }
 */
export function getFormulaBreakdown(formula, marks, customSubjectNames = {}) {
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
  const defaultSubjectNames = {
    'M': 'Mathematics',
    'P': 'Physics',
    'C': 'Chemistry',
    'B': 'Biology',
    'BOT': 'Botany',
    'ZOO': 'Zoology',
    'CS': 'Computer Science',
    'E': 'Economics',
    'CO': 'Commerce',
    'A': 'Accountancy',
    'S3': 'Subject 3',
    'S4': 'Subject 4',
    'S5': 'Subject 5',
    'S6': 'Subject 6',
    'THEORY': 'Theory',
    'PRACTICAL': 'Practical'
  }

  // Merge custom names with defaults
  const subjectNames = { ...defaultSubjectNames, ...customSubjectNames }

  // Normalize formula first (convert full names to codes)
  const normalizedFormula = normalizeFormula(formula)

  // Check for average formula pattern (S3 + S4 + S5 + S6) / 4
  if (normalizedFormula.includes('S3') && normalizedFormula.includes('S4')) {
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

  while ((match = termRegex.exec(normalizedFormula)) !== null) {
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
 * @param {Array<string>} subjects - Required group subject names
 * @returns {Object} Validation result with isValid and errors
 */
export function validateMarks(marks, subjects) {
  const errors = {}

  // All subjects to validate: 2 languages + group subjects
  const allSubjects = ['Language 1', 'Language 2', ...subjects]

  for (const subject of allSubjects) {
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

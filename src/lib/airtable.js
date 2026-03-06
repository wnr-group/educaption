/**
 * Airtable REST API Client
 *
 * This module provides functions to fetch data from Airtable tables
 * for the Tamil Nadu 12th standard cutoff calculator.
 */

// Environment variables
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID

// Base URL for Airtable API
const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0'

// Warn if environment variables are missing (don't throw - allow mock data fallback)
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.warn(
    'Airtable environment variables missing (VITE_AIRTABLE_API_KEY or VITE_AIRTABLE_BASE_ID). ' +
    'The app will work with mock data or return empty arrays.'
  )
}

/**
 * Core fetch function to retrieve records from an Airtable table
 *
 * @param {string} tableName - The name of the Airtable table
 * @param {Object} options - Query options
 * @param {string} [options.filterByFormula] - Airtable formula to filter records
 * @param {Array<{field: string, direction: 'asc'|'desc'}>} [options.sort] - Sort configuration
 * @param {number} [options.maxRecords] - Maximum number of records to return
 * @returns {Promise<Array<{id: string, [key: string]: any}>>} - Array of records with flattened fields
 */
export async function fetchTable(tableName, options = {}) {
  // Return empty array if credentials are missing
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn(`Cannot fetch ${tableName}: Airtable credentials not configured`)
    return []
  }

  try {
    // Build URL with query parameters
    const url = new URL(`${AIRTABLE_BASE_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`)

    // Add filter formula if provided
    if (options.filterByFormula) {
      url.searchParams.append('filterByFormula', options.filterByFormula)
    }

    // Add sort configuration if provided
    if (options.sort && Array.isArray(options.sort)) {
      options.sort.forEach((sortItem, index) => {
        url.searchParams.append(`sort[${index}][field]`, sortItem.field)
        url.searchParams.append(`sort[${index}][direction]`, sortItem.direction || 'asc')
      })
    }

    // Add max records if provided
    if (options.maxRecords) {
      url.searchParams.append('maxRecords', options.maxRecords.toString())
    }

    // Make the API request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Airtable API error (${response.status}): ${errorData.error?.message || response.statusText}`
      )
    }

    const data = await response.json()

    // Flatten records: merge id with fields
    return (data.records || []).map(record => ({
      id: record.id,
      ...record.fields
    }))
  } catch (error) {
    console.error(`Error fetching ${tableName} from Airtable:`, error.message)
    return []
  }
}

/**
 * Fetch all admission bodies (e.g., TNEA, DOTE)
 * @returns {Promise<Array>} Array of admission body records
 */
export async function getAdmissionBodies() {
  return fetchTable('Admission Bodies', {
    sort: [{ field: 'Name', direction: 'asc' }]
  })
}

/**
 * Fetch all courses
 * @returns {Promise<Array>} Array of course records
 */
export async function getCourses() {
  return fetchTable('Courses', {
    sort: [{ field: 'Name', direction: 'asc' }]
  })
}

/**
 * Fetch all subject groups (e.g., Group 1, Group 2)
 * @returns {Promise<Array>} Array of group records
 */
export async function getGroups() {
  return fetchTable('Groups', {
    sort: [{ field: 'Code', direction: 'asc' }]
  })
}

/**
 * Fetch all subject lists (subjects within groups)
 * @returns {Promise<Array>} Array of subject list records
 */
export async function getSubjectLists() {
  return fetchTable('Subject Lists', {
    sort: [{ field: 'Name', direction: 'asc' }]
  })
}

/**
 * Fetch all community categories (e.g., OC, BC, MBC, SC, ST)
 * @returns {Promise<Array>} Array of category records
 */
export async function getCategories() {
  return fetchTable('Categories', {
    sort: [{ field: 'Code', direction: 'asc' }]
  })
}

/**
 * Fetch all colleges
 * @returns {Promise<Array>} Array of college records
 */
export async function getColleges() {
  return fetchTable('Colleges', {
    sort: [{ field: 'Name', direction: 'asc' }]
  })
}

/**
 * Fetch all counselling information
 * @returns {Promise<Array>} Array of counselling records
 */
export async function getCounselling() {
  return fetchTable('Counselling', {
    sort: [{ field: 'Name', direction: 'asc' }]
  })
}

// Export configuration status for debugging
export const isConfigured = !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID)

// Export as object for convenience (matches plan structure)
export const airtable = {
  fetchTable,
  getAdmissionBodies,
  getCourses,
  getGroups,
  getSubjectLists,
  getCategories,
  getColleges,
  getCounselling,
  isConfigured
}

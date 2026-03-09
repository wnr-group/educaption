// React Query hooks for data fetching (Airtable backend)
export { useGroups, useGroupById, useGroupByCode } from './useGroups'
export { useAdmissionBodies, useAdmissionBodyById, useAdmissionBodyByName } from './useAdmissionBodies'
export { useCourses, useCourseById } from './useCourses'
export { useCategories, useCategoryById, useCategoryByCode } from './useCategories'
export { useSubjectLists, useSubjectListByName } from './useSubjectLists'
export { useColleges } from './useColleges'
export { useCounselling } from './useCounselling'

// Legacy export for backwards compatibility (streams -> admission bodies)
export { useAdmissionBodies as useStreams } from './useAdmissionBodies'

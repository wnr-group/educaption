// React Query hooks for data fetching (Airtable backend)
export { useGroups, useGroupById } from './useGroups'
export { useAdmissionBodies, useAdmissionBodyById } from './useAdmissionBodies'
export { useCourses, useCourseById } from './useCourses'
export { useCategories, useCategoryById } from './useCategories'
export { useSubjectLists, useSubjectListById } from './useSubjectLists'
export { useColleges } from './useColleges'
export { useCounselling } from './useCounselling'

// Legacy export for backwards compatibility (streams -> admission bodies)
export { useAdmissionBodies as useStreams } from './useAdmissionBodies'

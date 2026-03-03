import { createContext, useContext, useReducer, useCallback } from 'react'

// Initial state for the calculator
const initialState = {
  group: null,        // Selected group ID
  marks: {},          // Subject marks { subjectName: mark }
  category: null,     // Selected category ID
  results: null,      // Calculation results
  step: 1             // Current step (1, 2, or 3)
}

// Action types
const ACTIONS = {
  UPDATE_GROUP: 'UPDATE_GROUP',
  UPDATE_MARKS: 'UPDATE_MARKS',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  SET_RESULTS: 'SET_RESULTS',
  MOVE_TO_STEP: 'MOVE_TO_STEP',
  RESET: 'RESET'
}

// Reducer function
function calculatorReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_GROUP:
      return {
        ...state,
        group: action.payload,
        marks: {},       // Reset marks when group changes
        results: null    // Reset results
      }

    case ACTIONS.UPDATE_MARKS:
      return {
        ...state,
        marks: action.payload
      }

    case ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        category: action.payload
      }

    case ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload
      }

    case ACTIONS.MOVE_TO_STEP:
      return {
        ...state,
        step: action.payload
      }

    case ACTIONS.RESET:
      return initialState

    default:
      return state
  }
}

// Create context
const CalculatorContext = createContext(null)

/**
 * Calculator Provider component
 * Manages calculator state and provides methods to update it
 */
export function CalculatorProvider({ children }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)

  // Update selected group
  const updateGroup = useCallback((groupId) => {
    dispatch({ type: ACTIONS.UPDATE_GROUP, payload: groupId })
  }, [])

  // Update marks object
  const updateMarks = useCallback((marks) => {
    dispatch({ type: ACTIONS.UPDATE_MARKS, payload: marks })
  }, [])

  // Update single mark
  const updateSingleMark = useCallback((subject, mark) => {
    dispatch({
      type: ACTIONS.UPDATE_MARKS,
      payload: { ...state.marks, [subject]: mark }
    })
  }, [state.marks])

  // Update selected category
  const updateCategory = useCallback((categoryId) => {
    dispatch({ type: ACTIONS.UPDATE_CATEGORY, payload: categoryId })
  }, [])

  // Set calculation results
  const setResults = useCallback((results) => {
    dispatch({ type: ACTIONS.SET_RESULTS, payload: results })
  }, [])

  // Move to a specific step
  const moveToStep = useCallback((step) => {
    dispatch({ type: ACTIONS.MOVE_TO_STEP, payload: step })
  }, [])

  // Go to next step
  const nextStep = useCallback(() => {
    if (state.step < 3) {
      dispatch({ type: ACTIONS.MOVE_TO_STEP, payload: state.step + 1 })
    }
  }, [state.step])

  // Go to previous step
  const prevStep = useCallback(() => {
    if (state.step > 1) {
      dispatch({ type: ACTIONS.MOVE_TO_STEP, payload: state.step - 1 })
    }
  }, [state.step])

  // Reset calculator to initial state
  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET })
  }, [])

  const value = {
    // State
    ...state,

    // Methods
    updateGroup,
    updateMarks,
    updateSingleMark,
    updateCategory,
    setResults,
    moveToStep,
    nextStep,
    prevStep,
    reset
  }

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  )
}

/**
 * Hook to access calculator context
 * @returns Calculator context value
 */
export function useCalculatorContext() {
  const context = useContext(CalculatorContext)

  if (!context) {
    throw new Error('useCalculatorContext must be used within a CalculatorProvider')
  }

  return context
}

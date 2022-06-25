/**
 * NOTE: We assume that the input data is organised as one-depth collections of items, as visually described below. This
 * restricts nesting in the grouped list. So, constrained by this, we track one-depth collections of checkboxes (aptly
 * named "checklist"); each collection is named and each checkbox in a collection is accompanied by a named key (e.g.
 * the identifier of the external element that it's semantically tied to). BUT, the Checklist type supports infinitely
 * nested checklists!
 *
 * The checklist itself acts as a global checkbox, with the "completed" state that can take up one of three possible
 * values: true, false or indeterminate.
 *
 * data = {
 *   c-1: [{ a-1: ..., ... },  where c-1 is the name of a collection,
 *         { a-1: ..., ... },        a-1 is the name of an attribute
 *         ...
 *        ],
 *   c-2: [...],
 *   ...
 * }
 *
 */

import { CheckedState } from '@radix-ui/react-checkbox'
import { useRef, useState } from 'react'

type Flat = { [key: string]: CheckedState }
type Nest = { [key: string]: Checklist }
type Checklist = Flat | Nest

/* TODO: Update functionality to handle deeply nested checklists */
export default function useChecklist(data: { [key: string]: object[] }, property: string, value: boolean = false) {
  /**
   * NOTE: For each collection, we reduce the items (e.g. [{a-1: ..., ...}, ...]) into a checklist that takes the
   * title of the collection (e.g. c-1). We then collect all the collection-specific checklists into a nested one (see
   * the type of Checklist). Also, property is the identifier of the external element (e.g. title or id)
   */
  function defaultChecklist(data: { [key: string]: object[] }, property: string, value: boolean = false): Checklist {
    return Object.fromEntries(
      Object.entries(data).map(([title, items]: [string, object[]]) => {
        /* Generate a collection-specific flat checklist */
        const checklist: Flat = items.reduce(
          (accumulator: Flat, item: any) => ({
            ...accumulator,
            [item[property]]: value,
          }),
          {}
        )
        return [title, checklist]
      })
    )
  }

  function recomputeCheckedState(checklist: Checklist) {
    const indeterminate: boolean = Object.keys(checklist).reduce(
      (accumulator: boolean, title: string) => accumulator || isIndeterminate(title),
      false
    )
    const complete: boolean = Object.keys(checklist).reduce(
      (accumulator: boolean, title: string) => accumulator && isComplete(title),
      true
    )
    const newCheckedState: CheckedState = indeterminate ? 'indeterminate' : complete
    setCheckedState(newCheckedState)
  }

  /* Marks all items in the named checklist (as specified by title) with the provided value */
  function onCollectionCheck(title: string, value: CheckedState) {
    const updatedChecklist: Checklist = {
      ...(checklist as Nest),
      [title]: Object.fromEntries(Object.keys(checklist[title]).map((property) => [property, value])),
    }
    setChecklist(updatedChecklist)
    recomputeCheckedState(updatedChecklist)
  }

  /* Marks a specific item in the named checklist (as specified by title) with the provided value */
  function onItemCheck(title: string, property: string, value: CheckedState) {
    const updatedChecklist: Checklist = {
      ...(checklist as Nest),
      [title]: { ...(checklist[title] as Flat), [property]: value },
    }
    setChecklist(updatedChecklist)
    recomputeCheckedState(updatedChecklist)
  }

  /* Toggle all checklist items between true and false */
  function onToggle(value: boolean) {
    setChecklist(defaultChecklist(configRef.current.data, configRef.current.property, !value))
    setCheckedState(value)
  }

  function isIndeterminate(title: string): boolean {
    const values = Object.values(checklist[title])
    return values.some(Boolean) && !values.every(Boolean)
  }

  function isComplete(title: string): boolean {
    return Object.values(checklist[title]).every(Boolean)
  }

  function getCheckedState(): CheckedState {
    return checkedState
  }

  const [checklist, setChecklist] = useState<Checklist>(defaultChecklist(data, property, value))
  const [checkedState, setCheckedState] = useState<CheckedState>(false)
  const configRef = useRef({ data, property })
  const checklistManager = { onCollectionCheck, onItemCheck, isIndeterminate, isComplete, onToggle, getCheckedState }

  return checklistManager
}

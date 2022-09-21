import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import { useOutletContext } from 'react-router'
import { createMock } from 'ts-jest-mock'

import { baseURL } from '../../constants/endpoints'
import { AxiosContext, useAxios } from '../../lib/axios.context'
import { useGame } from '../../lib/game/game.context'
import { useMaterials } from '../../lib/materials.service'
import {
  fakeCourse,
  fakeGroupedMaterials,
  fakeLevel1Resource,
  fakeLeveledMaterials,
  fakeRawMaterials,
  fakeUnleveledMaterials,
  fakeUnleveledResource,
  mockLevelsManagerFactory,
} from './fakeLevelMaterials'

jest.mock('react-router')
const useOutletContextMock = createMock(useOutletContext)
const fakeOutletContext = { moduleCode: fakeCourse }

jest.mock('../../lib/game/game.context')
const useGameMock = createMock(useGame)
const fakeGameProvider = { includeLevels: true, toggleIncludeLevels: () => {} }

jest.mock('../../lib/axios.context')
const useAxiosMock = createMock(useAxios)
const fakeMaterialsResponse = { data: fakeRawMaterials, loaded: true, error: '', cancel: () => {} }

const MockCompleteResourcesProvider = ({ children }: { children: React.ReactNode }) => (
  <AxiosContext.Provider value={mockAxiosCompleteResources}>{children}</AxiosContext.Provider>
)

const mockAxiosCompleteResources: any = {
  request: jest.fn(async () => ({ data: [] })),
}

beforeEach(() => {
  useOutletContextMock.mockReturnValue(fakeOutletContext)
  useGameMock.mockReturnValue(fakeGameProvider)
  useAxiosMock.mockReturnValue(fakeMaterialsResponse)
})

test('can group materials by selected level', async () => {
  const selectedLevel = 1
  const levelsManager = mockLevelsManagerFactory({ selectedLevel })
  const { result } = renderHook(() => useMaterials(levelsManager), {
    wrapper: MockCompleteResourcesProvider,
  })

  await waitFor(() =>
    expect(result.current.groupedMaterials).toStrictEqual({
      ...fakeUnleveledMaterials,
      ...fakeLeveledMaterials[selectedLevel - 1],
    })
  )
})

test('includes all materials when levels are disabled', async () => {
  useGameMock.mockReturnValue({ ...fakeGameProvider, includeLevels: false })
  const levelsManager = mockLevelsManagerFactory({})
  const { result } = renderHook(() => useMaterials(levelsManager), {
    wrapper: MockCompleteResourcesProvider,
  })

  await waitFor(() => expect(result.current.groupedMaterials).toStrictEqual(fakeGroupedMaterials))
})

describe('includes unleveled materials in all levels:', () => {
  for (let level = 0; level < fakeLeveledMaterials.length; level++) {
    it(`level ${level}`, async () => {
      const levelsManager = mockLevelsManagerFactory({ selectedLevel: level })
      const { result } = renderHook(() => useMaterials(levelsManager), {
        wrapper: MockCompleteResourcesProvider,
      })

      /* Wait for groupedMaterials to be fetched then set groupedMaterials */
      await waitFor(() => expect(useAxios).toBeCalled())
      act(() => result.current.setRawMaterials(fakeRawMaterials))

      expect(result.current.groupedMaterials[fakeUnleveledResource.category]).toContainEqual(
        fakeUnleveledResource
      )
    })
  }
})

test('can add complete resources', async () => {
  const levelsManager = mockLevelsManagerFactory({})
  const { result } = renderHook(() => useMaterials(levelsManager), {
    wrapper: MockCompleteResourcesProvider,
  })

  const completeResources = [fakeUnleveledResource.id, fakeLevel1Resource.id]
  act(() => {
    result.current.addCompleteResources(completeResources)
  })

  await waitFor(() =>
    expect(mockAxiosCompleteResources.request).toBeCalledWith({
      method: 'POST',
      url: `${baseURL}/resources/complete`,
      data: completeResources,
    })
  )

  completeResources.forEach((resourceId) => expect(result.current.isComplete(resourceId)))
})

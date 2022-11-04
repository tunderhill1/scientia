import { instanceToPlain, plainToInstance } from 'class-transformer'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { EnrolledStudent, Exercise, Group, GroupMembersActions } from '../constants/types'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { errorMessage } from './utilities.service'

/* --------------------------- ExerciseDialog.tsx --------------------------- */

export const useGroup = ({ moduleCode, number: exerciseNumber, submissionType }: Exercise) => {
  const axiosInstance = useContext(AxiosContext)
  const { year } = useParams()
  const { addToast } = useToast()
  const [groupIsLoaded, setGroupIsLoaded] = useState<boolean>(false)

  const [group, setGroup] = useState<Group | null>(null)
  useEffect(() => {
    if (submissionType !== 'group') return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissionGroup(year!, moduleCode!, exerciseNumber),
      })
      .then(({ data }: { data: any }) => {
        setGroup(plainToInstance(Group, data))
      })
      .catch((error) => {
        const message = errorMessage(error)
        if (!message?.startsWith('No group exists'))
          addToast({ variant: 'error', title: 'Unable to get group details' })
      })
      .finally(() => setGroupIsLoaded(true))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, submissionType, year])

  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([])
  useEffect(() => {
    if (!(moduleCode && exerciseNumber && submissionType === 'group')) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.enrolledStudentsWithAvailability(year!, moduleCode, exerciseNumber),
      })
      .then(({ data }: { data: any }) => {
        setEnrolledStudents(data.map((person: any) => plainToInstance(EnrolledStudent, person)))
      })
      .catch((error) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Unable to get list of students enrolled to module' })
      })
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, submissionType, year])

  const deleteMember = (memberId: number, asMember: boolean = false) => {
    if (!group) return
    axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.groupMember(group.id, memberId),
      })
      .then(() => {
        let deletedMember = group.members.find((member) => member.id === memberId)
        if (asMember) {
          // User is leaving the group: reset the group
          setGroup(null)
          setEnrolledStudents([])
        } else if (deletedMember !== undefined) {
          // Leader is deleting a member: update the group
          setGroup((group) => {
            const newMembers = group!.members.filter((member) => member.id !== memberId)

            // There *must* be a way to avoid (de)serialisation and treat Group as a simple class. Need to dig deeper.
            return plainToInstance(Group, {
              ...instanceToPlain(group),
              members: newMembers.map((m) => instanceToPlain(m)),
            })
          })
          setEnrolledStudents((people) =>
            people.map((person) =>
              person.login === deletedMember!.username
                ? plainToInstance(EnrolledStudent, { ...person, available: true })
                : person
            )
          )
        }
      })
      .catch((error: any) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Failed to remove the indicated member' })
      })
  }

  const sendInvite = (invitedUsernames: string[]) => {
    if (!group) return
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.inviteMembers(group.id),
        data: invitedUsernames.map((username) => ({ username })),
      })
      .then(({ data }: { data: any }) => {
        setGroup((group) => {
          return plainToInstance(Group, {
            ...instanceToPlain(group),
            members: data,
          })
        })
        setEnrolledStudents((people) =>
          people.map((person) =>
            invitedUsernames.includes(person.login)
              ? plainToInstance(EnrolledStudent, { ...instanceToPlain(person), available: false })
              : person
          )
        )
      })
      .catch((error: any) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Failed to add the indicated member' })
      })
  }

  /**
   * @param accepted Answer invitation with an accept or decline.
   * @param memberId ID of the member to accept/decline.
   */
  const answerInvite = (accepted: boolean, memberId: number) => {
    if (!group) return
    axiosInstance
      .request({
        method: 'PATCH',
        url: endpoints.submissionUpdateInvitationStatus(group.id, memberId),
        params: { accepted },
      })
      .then(() => {
        if (accepted) {
          setGroup((group) => {
            let currMembers = group!.members
            let newMembers = !accepted
              ? currMembers.filter((member) => member.id !== memberId)
              : currMembers.map((member) => {
                  return member.id === memberId
                    ? { ...instanceToPlain(member), accepted: new Date().toJSON() }
                    : instanceToPlain(member)
                })
            return plainToInstance(Group, {
              ...instanceToPlain(group),
              members: newMembers,
            })
          })
        } else {
          setGroup(null)
          setEnrolledStudents([])
        }
      })
      .catch((error: any) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Failed to update status of membership invite' })
      })
  }

  const createGroup = () => {
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.submissionGroups,
        data: {
          year,
          module_code: moduleCode!,
          exercise_number: exerciseNumber,
        },
      })
      .then(({ data }: { data: any }) => setGroup(plainToInstance(Group, data)))
      .catch((error) => {
        console.log(error)
        addToast({ variant: 'error', title: 'Failed to create a group' })
      })
  }

  const membersActions: GroupMembersActions = {
    deleteMember,
    sendInvite,
    answerInvite,
  }

  return { groupIsLoaded, enrolledStudents, group, setGroup, createGroup, membersActions }
}

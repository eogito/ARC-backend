
export class UserHelp {
  static usersTypes() {
    return  [
      {
        typeId: 1,
        typeKey: 'Practitioner',
        typeName: 'Practitioner'
      },
      {
        typeId: 2,
        typeKey: 'RECEIPTS',
        typeName: 'Receipts'
      },
      {
        typeId: 3,
        typeKey: 'MANAGER',
        typeName: 'Manager'
      },
      {
        typeId: 4,
        typeKey: 'ADMIN',
        typeName: 'Admin'
      }
    ]
  }
  static getUserTypeAllowList(typeId: number) {
    const types = UserHelp.usersTypes()
    const allowTypes = []
    types.forEach(typeObj => {
      if (typeId === 2) {
        if (typeObj.typeId === 1) {
          allowTypes.push(typeObj)
        }
      }
      if (typeId === 3) {
        const allowsIds = [1, 2]
        if (allowsIds.includes(typeObj.typeId)) {
          allowTypes.push(typeObj)
        }
      }
      if (typeId === 4) {
        const allowsIds = [1, 2, 3]
        if (allowsIds.includes(typeObj.typeId)) {
          allowTypes.push(typeObj)
        }
      }
      if (typeId === 5) {
        const allowsIds = [1, 2, 3, 4]
        if (allowsIds.includes(typeObj.typeId)) {
          allowTypes.push(typeObj)
        }
      }
    })
    return allowTypes
  }

  static getUserTypeAllowIds(typeId: number) {
    const types = UserHelp.usersTypes()
    const allowIds = []
    types.forEach(typeObj => {
      if (typeId === 2) {
        if (typeObj.typeId === 1) {
          allowIds.push(typeObj.typeId)
        }
      }
      if (typeId === 3) {
        const allowsIds = [1, 2]
        if (allowsIds.includes(typeObj.typeId)) {
          allowIds.push(typeObj.typeId)
        }
      }
      if (typeId === 4) {
        const allowsIds = [1, 2, 3]
        if (allowsIds.includes(typeObj.typeId)) {
          allowIds.push(typeObj.typeId)
        }
      }
      if (typeId === 5) {
        const allowsIds = [1, 2, 3, 4]
        if (allowsIds.includes(typeObj.typeId)) {
          allowIds.push(typeObj.typeId)
        }
      }
    })
    return allowIds
  }

  static checkAllowTypeId(sessionMembrTypeId: number, userTypeId: number) {
    const allowTypeIds = UserHelp.getUserTypeAllowIds(sessionMembrTypeId)
    if (allowTypeIds.includes(userTypeId)) {
      return true
    } else {
      return false
    }
  }
}
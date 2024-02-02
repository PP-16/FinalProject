export interface Passentger {
    passengerId: number,
    passengerName: string,
    idCardNumber: string,
    email: string,
    password: string,
    phone: string,
    roleId: number,
    roles: Role,
    token: string
    newPass: string,
    checkNew: string
    isUse: any
}

export interface Role {
    roleId: number,
    roleName: string,
    roleNameTH: string
    isUse: boolean
}
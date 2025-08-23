export interface RegisterData {
    username: string | ""
    password: string | ""
    confirmPassword: string | ""
    role: number | 0

}
export interface Role {
    roleId: number
    roleName: string
}
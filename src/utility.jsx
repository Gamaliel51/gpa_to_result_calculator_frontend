export const checkAuth = () => {
    const accessToken  = sessionStorage.getItem('accessToken')
    if(!accessToken){
        return false
    }
    return true
}

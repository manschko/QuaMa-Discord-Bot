module.exports = {
    sanitize_name

}
function sanitize_name(string) {
    let s = string.replace(/[^a-zA-Z0-9{}()# ]/g, '');
    const varibles =  s.match(/{{.*?}}+/g)
    const vaiable_filter = /\busername|counter\b/
    varibles.forEach(x => {
        if(!vaiable_filter.test(x.replace(/[{}]/g, ''))){
            s = s.replace(x, '')
        }else{
            s = s.replace(x, '!!' + x.replace(/[{}]/g, '') + '<<')
        }
    })
    s = s.replace(/[{}]/g, '')
    s = s.replace(/!!/g, '${')
    s = s.replace(/<</g, '}')
    return s

}
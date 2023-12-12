export const removeFile = async (pathfile:string) =>{
    
        const nameArr = pathfile.split('/')
        const nameFile = nameArr[nameArr.lenth-1]
        const [public_id] = nameFile.split('.')
        cloudinary.uploader.destroy(public_id)

}
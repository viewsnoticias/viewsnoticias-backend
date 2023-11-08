import {v2 as cloudinary} from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? 'cloudinary://987242662715966:yUlMtQmb9UxCgywKBTC5KX-oRPs@dptbdos97');


export const uploadFile = async (tmpPath)=>{

    try{
        const {secure_url} = await cloudinary.uploader.upload(tmpPath)
        if(secure_url){
            return secure_url
        }
    } catch (err) {
        console.error('fallo la carga de imagen a cloudinary = ',err)
    }
} 

export const destroitFile = async(idFile:string) =>{
    
    const nameArr = idFile.split('/')
    const nameFile = nameArr[nameArr.length-1]
    const [public_id] = nameFile.split('.')
    cloudinary.uploader.destroy(public_id)
    
}

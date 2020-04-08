'use strict';
const {AllHtmlEntities} = require('html-entities'),
    cryptr = require('cryptr'),
    Slugify = require('slugify'),
    Axios = require('axios'),
    {readFile} = require('fs'),
    moment = require('moment'),
    Excel = require('excel4node'),
    entities = new AllHtmlEntities(),
    multer = require('multer'),
    {access,unlink,F_OK} = require('fs'),
    jwt = require('jsonwebtoken'),
    {createHash} = require('crypto'),
    ERRORS = require('./error');


const randomString = (N=10)=>{
    return Array(N + 1)
      .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
      .slice(0, N);
  };

const md5 = (plainText=Date.now().toString())=>{
  return createHash('md5')
    .update(plainText)
    .digest('hex');
}
 
const deleteFile = async (file)=>{
    if(await fileExists(file)){
      return new Promise((resolve, reject) => {
        unlink(file, err => {
          return err ? reject(err) : resolve(true);
        });
      });
    } return false;
  };

const decodeJwt = (cipher,secreteKey=process.env.APP_KEY)=>{
  const token = cipher.split(' ').pop();
  return new Promise((ful, rej) => {
    if(!secreteKey) return rej(new Error("Kindly supply secret key"));
    jwt.verify(token, secreteKey, (err, data) => {
      if (err) rej(err);
      return ful(data);
    });
  });
}

const encodeJwt = ({
  data,
  secreteKey=process.env.APP_KEY,
  duration = "24h"
})=>{
  return new Promise((ful, rej) => {
    if(!secreteKey) return rej(new Error("Kindly supply secret key"));
    jwt.sign(data, secreteKey, {expiresIn:duration},(err,token)=>{
      if(err) rej(err);
      ful(token);
    });
  });
}

const fileExists = (file)=>{
  return new Promise((resolve,reject)=>{
    access(file,F_OK,(err)=>{
      if(err) resolve(false);
      resolve(true);
    })
  });
}

const validate = async (schema,object,option={abortEarly:true,allowUnknown:true})=>{
  try {
    await schema.validateAsync(object,option);
  } catch (err) {
    throw new ERRORS.ValidationError(err.message);
  }
}

const removeUpload = async(files)=>{
    if(Array.isArray(files)){
      files.map(async(image)=>await deleteFile(image.path));
    } else{
      await deleteFile(files.path);
    }
  };

const uniqueString = (capitalize=false)=>{
    const now = Array.from(Date.now().toString());
    let result='';
    for(let i=0; i<now.length; i++){
      if(i%4 === 0)
        result+=randomString(2);
      result+=now[i];
    }
    return capitalize ? result.toUpperCase() : result;
  };

  const errorMessage = (err = void 0,ERROR_TYPE='FATAL_ERROR')=>{
    let message;
    if (err && err.errors) 
      message = err.errors[0] ? err.errors[0].message : "Something went wrong.";
    else if (err && err.message) message = err.message;
    else if (typeof err == 'string') message = err;
    else message = 'Something went wrong';
    
    if(process.env.NODE_ENV !== "production"){
      console.log("=======================================");
      console.log(err);
      console.log("=======================================");
    }
    const response = { success: false, message};
    response.error = err.name || ERROR_TYPE;
    if (err.httpStatusCode) response.httpStatusCode = err.httpStatusCode;
    return response;
  };

  const decrypt=(cipherText,secret)=>{
    let crypto = new cryptr(secret);
      crypto = crypto.decrypt(cipherText);
      if(!crypto) throw new ERRORS.InvalidTokenError("Supplied token not valid");    
  
      let { plainText, expire = void 0 } = JSON.parse(crypto);
    
      if (expire && Date.now() > expire) throw new ERRORS.TokenExpiredError("Supplied token expired"); 
      
      return plainText;
  };

const rand = (min=0,max=10000)=>{
		return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  
const uploadFile = ({ 
  name=null, 
  limit = 5, 
  allowedFormat = ['jpg','jpeg','png','gif'], 
  location='/' 
}) => {
  /* Set storage to s3 */
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, location);
    },
    filename: (req, file, cb) => {
      let mimetype = file.mimetype.split('/')[1];
      cb(null, name ? name + '.' + mimetype : `${uniqueString()}.${mimetype}`);
    },
  });

  /* Limit is converted to bytes from megabyte */
  const limits = { fileSize: limit * 1000000 };

  /* Restrict file format to allowed ones */
  const fileFilter = (req, file, cb) => {
    if(allowedFormat.length === 0) return cb(null,true);
    if (
      allowedFormat.includes(
        file.originalname
          .split('.')
          .pop()
          .toLowerCase()
      )
    ) {
      return cb(null, true);
    } else {
      return cb(
        `File format not allowed, allowed formats are: ${allowedFormat.join(
          ', '
        )}`
      );
    }
  };

  return multer({ storage, limits, fileFilter });
}

module.exports = {
  success : true,
  randomString,
  uniqueString,
  uploadFile,
  rand,
  decrypt,
  errorMessage,
  deleteFile,
  encodeJwt,
  decodeJwt,
  fileExists,
  removeUpload,
  md5,
  validate,
  InvalidTokenError:ERRORS.InvalidTokenError, 
  TokenExpiredError : ERRORS.TokenExpiredError, 
  AuthenticationError : ERRORS.AuthenticationError, 
  AuthorizationError : ERRORS.AuthorizationError,
  EntryExistError : ERRORS.EntryExistError, 
  EntryNotFoundError : ERRORS.EntryNotFoundError,
  NotFoundError : ERRORS.EntryNotFoundError,
  ExistsError : ERRORS.EntryExistError,
  ValidationError : ERRORS.ValidationError,
  
  slugify : (value,lowerCase=true)=>{
    if(lowerCase)
      return Slugify(value, {
        remove: /[*,}{》《`^#+~.()%&'"!:@]/g,
        lower : true
      });

    return Slugify(value, {
      remove: /[*,}{》《`^#+~.()%&'"!:@]/g,
      lower : false
    });
  },



  htmlEncode : (value)=>{
      return entities.encodeNonUTF(value);
  },

  htmlDecode : (value)=>{
      return entities.decode(value);
  },

  /* Display success message */
  successMessage : (message)=>{
      return { success: true, message};
  },

  /* Make a get request */
  getContent : async({url, method='GET',headers={},token=undefined,data=undefined})=>{
      try {
          headers['X-Requested-With'] = 'XMLHttpRequest';
          token && (headers['Authorization']=token);
          const payload = {
            method,
            url,
            headers,
          };

          if(data) payload.data = data;

          const result = await Axios(payload);
      
          return result.data;
      } catch (err) {
        throw err.response ? {...err.response.data, httpStatusCode:err.response.status} || err.response : err;
      }
  },

  /* Make a post request */
  postContent : async({ url, token, data, method = 'POST', headers={} })=>{
      try {
          headers['X-Requested-With'] = 'XMLHttpRequest';
          token && (headers['Authorization']=token);
    
          const result = await Axios({
              method,
              url,
              data,
              headers
          });
    
        return result.data;
      } catch (err) {
        throw err.response ? {...err.response.data, httpStatusCode:err.response.status} || err.response : err;
      }
  },

  encrypt : (plainText,secret,expire =undefined)=>{
      const crypto = new cryptr(secret);
      /* Convert expire duration to miliseconds */
      expire = expire ? Date.now() + expire * 60 * 1000 : expire;
      return crypto.encrypt(JSON.stringify({ plainText, expire }));
  },

  readJson : (path)=>{
      return new Promise((ful, rej) => {
        readFile(path, (err, data) => {
          if (err) {
            rej(err);
          } else {
            ful(JSON.parse(data));
          }
        });
      });
  },


  dateFormat : (date,format="DD-MM-YYYY")=>{
      return moment(date).format(format)
  },

  toExcel : async ({ data, header, name="report", columnWidth=[] })=>{
      try {
        const workBook = new Excel.Workbook(),
          sheet = workBook.addWorksheet(name),
          arrayLength = data.length,
          configColumnLength = columnWidth.length;
    
          for(let i=0; i < header.length; i++){
            sheet.cell(1,(i+1)).string(`${header[i]}`);
          }
    
          for(let i=0;i<arrayLength;i++){
            const value = Object.values(data[i]);
    
            for(let j=0;j<value.length;j++){
              sheet.cell((i+2),j+1).string(`${value[j]}`);
            }
          }
          
          if( configColumnLength > 0 ){
            columnWidth.forEach(({column,width})=>{
              sheet.column(column).setWidth(width);
            });
          }
    
          return await workBook.writeToBuffer();
      } catch (err) {
        throw err;
      }
  },
  
  isFile : async(filePath)=>{
    return new Promise((resolve, reject) => {
      access(filePath, F_OK, err => {
        return err ? resolve(false) : resolve(true);
      });
    });
  },
  
  notFound : (message)=>{
    return { success: false, message};
  },

  appRequestOnly : ()=>{
    return (req,res,next)=>{
      try {
        const APP_KEY = req.headers.app_key;
        if(!APP_KEY)
          return res.status(401).json(errorMessage("Missing request parameter"));
    
        if(decrypt(APP_KEY,process.env.APP_KEY) !== process.env.APP_KEY)
          return res.status(401).json(errorMessage("Unknown request source not allowed"));
    
        return next();
      } catch (err) {
        return res.status(500).json(errorMessage(err))
      }
    }
  },

  paginate : (totalCount,currentPage,perPage)=>{
    const previousPage = currentPage - 1;
    return {
      pageCount : Math.ceil(totalCount / perPage),
      offset :  currentPage > 1 ? previousPage * perPage : 0
    };
  },
  
  isAjaxRequest : (xhr,headers=null)=>{
    if(xhr) return true;
    else if(headers && headers.accept.indexOf('json') > -1)
      return true;
    return false;
  }
};
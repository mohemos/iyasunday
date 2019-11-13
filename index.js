'use strict';
const {AllHtmlEntities} = require('html-entities'),
    cryptr = require('cryptr'),
    Slugify = require('slugify'),
    Axios = require('axios'),
    {readFile} = require('fs'),
    moment = require('moment'),
    Excel = require('excel4node'),
    entities = new AllHtmlEntities(),
    pdfKit = require("pdfkit"),
    multer = require('multer'),
    unlink = require('fs').unlink;

const randomString = (N=10)=>{
    return Array(N + 1)
      .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
      .slice(0, N);
  };
 
const deleteFile = async (file)=>{
    return new Promise((resolve, reject) => {
      unlink(file, err => {
        return err ? reject(err) : resolve(true);
      });
    });
  };

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

const errorMessage = (err = void 0)=>{
    let message;
    if (err && err.errors) {
      message = err.errors[0].message;
    } else if (err && err.message) {
      message = err.message;
    } else if (typeof err == 'string') {
      message = err;
    } else {
      message = 'Something went wrong';
    }
    
    if(process.env.NODE_ENV !== "production"){
      console.log("=======================================");
      console.log(err);
      console.log("=======================================");
    }
    return { success: false, message, data:[] };
};

const decrypt=(cipherText,secret)=>{
    const crypto = new cryptr(secret);
  
    let { plainText, expire = void 0 } = JSON.parse(crypto.decrypt(cipherText));
  
    if (expire && Date.now() > expire) {
      throw new Error('Authentication token expired');
    }
  
    return plainText;
  };

const rand = (min=0,max=10000)=>{
		return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  
const uploadFile = ({ 
  name=null, 
  limit = 5, 
  allowedFormat = ['jpg','jpeg','png','gif'], 
  location 
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
  removeUpload,
  slugify : (value,lowerCase=true)=>{
      return lowerCase ? Slugify(value).toLowerCase() : Slugify(value);
  },

  htmlEncode : (value)=>{
      return entities.encodeNonUTF(value);
  },

  htmlDecode : (value)=>{
      return entities.decode(value);
  },

  /* Display success message */
  successMessage : (message)=>{
      return { success: true, message, data:[] };
  },

  /* Make a get request */
  getContent : async({url, method='GET',headers={},token=undefined})=>{
      try {
          headers['X-Requested-With'] = 'XMLHttpRequest';
          token && (headers['Authorization']=token);

          const result = await Axios({
            method,
            url,
            headers
          });
      
          return result.data;
      } catch (err) {
          throw err.response ? err.response.data || err.response : err;
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
        throw err.response ? err.response.data || err.response : err;
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

};
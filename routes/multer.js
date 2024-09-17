const multer=require('multer');
const {v4:uuidv4}=require('uuid');
const path=require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
      const uniq=uuidv4();

      cb(null, uniq+path.extname(file.originalname));// File unique name can be possible by this line 
    }
  });

  const upload = multer({ storage: storage });
  module.exports=upload;
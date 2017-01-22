import multer from 'koa-multer'
import path from 'path'

/***
 * 说明：该方法只支持：`multipart/form-data`方式的上传。postman可以调试。
 */

let storage = multer.diskStorage({
  // 设置上传后文件路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../assets/uploads/'))
  },
  // 给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split('.')
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})

export let upload = multer({
  storage: storage,
  // dest: 'uploads/', //上传文件保存的路径，如果你想在上传时进行更多的控制, 你可以使用storage选项替代dest. Multer 具有 DiskStorage 和 MemoryStorage 两个存储引擎; 另外还可以从第三方获得更多可用的引擎.
  // fileFilter: function (req, file, cb) {
  //     let mimetypes = (['text/*', 'image/*', 'video/*', 'audio/*', 'application/zip']).join(',');
  //     let testItems = file.mimetype.split('/');
  //     if ((new RegExp('\b' + testItems[0] + '/\*', 'i')).test(mimetypes) || (new RegExp('\*/' + testItems[1] + '\b', 'i')).test(mimetypes) || (new RegExp('\b' + testItems[0] + '/' + testItems[1] + '\b', 'i')).test(mimetypes)) {
  //         cb(null, true);
  //     } else {
  //         return cb(new Error('Only image, plain text, audio, video and zip format files are allowed!'), false);
  //     }
  // }, // fileFilter要在这里声明才行，用instance.fileFilter = funciton(){};是不管用的,
  limits: {
    fileSize: 200 * 1024 * 1024 // Max file size in bytes (20 MB) 限制上传的文件大小，不设置则是无限
  }
})

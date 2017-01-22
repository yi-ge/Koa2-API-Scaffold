import nodemailer from 'nodemailer'

// 发送Email（目前使用的是阿里云SMTP发送邮件）
// receivers 目标邮箱，可以用英文逗号分隔多个。（我没试过）
// subject 邮件标题
// text 文本版本的邮件内容
// html HTML版本的邮件内容
// 返回
// result 200是成功，500是失败
// info 是返回的消息，可能是结果的文本，也可能是对象。（这个错误不要暴露给用户）
export let sendemail = (receivers, subject, text, html) => {
  return new Promise(function (resolve) {
    let transporter = nodemailer.createTransport('smtp://postmaster%40abcd.com:password@smtp.abcd.com')

    // setup e-mail data with unicode symbols
    let mailOptions = {
      from: '"XX平台 👥" <postmaster@abcd.com>', // sender address
      to: receivers,
      subject: subject,
      text: text || 'Hello world 🐴', // plaintext body
      html: html || '<b>Hello world 🐴</b>' // html body
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve({
          result: 500,
          info: error
        })
      } else {
        resolve({
          result: 200,
          info: info.response
        })
      }
    })
  })
}

const OSS = require('ali-oss').Wrapper
const formidable = require('formidable')
const multiparty = require('multiparty')
const co = require('co')

exports.uploadFile = async (ctx,next) => {
    let alioss_uploadfile = function() {
        return new Promise(function(resolve, reject) {
            //上传单文件，使用formidable
            /*let form = new formidable.IncomingForm()
             form.parse(ctx.req, function(err, fields, files) {
             if (err) { ctx.throw('500',err)}
             // 文件名
             let date = new Date()
             let time = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
             let filepath = 'project/'+time + '/' + date.getTime()
             let fileext = files.file.name.split('.').pop()
             let upfile = files.file.path
             let newfile = filepath + '.' + fileext
             //ali-oss
             co(function*() {
             client.useBucket('p-adm-test')
             let result = yield client.put(newfile, upfile)
             console.log('文件上传成功!', result.url)
             let data=[]
             data.push(result.url)
             ctx.response.type = 'json'
             ctx.response.body = {
             errno: 0,
             data: data
             }
             resolve(next())
             }).catch(function(err) {
             console.log(err)
             })
             })*/
            //上传多文件，使用multiparty
            let form = new multiparty.Form({
                encoding: 'utf-8',
                keepExtensions: true  //保留后缀
            })
            form.parse(ctx.req, async function (err, fields, files) {
                let data=[]
                for(let f of files.file){
                    // 文件名
                    let date = new Date()
                    let time = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
                    let filepath = 'project/'+time + '/' + date.getTime()
                    let fileext = f.originalFilename.split('.').pop()
                    let upfile = f.path
                    let newfile = filepath + '.' + fileext
                    await client.put(newfile, upfile).then((results) => {
                        console.log('文件上传成功!', results.url)
                        data.push(results.url)

                    }).catch((err) => {
                        console.log(err)
                    })
                }
                ctx.response.type = 'json'
                ctx.response.body = {
                    errno: 0,
                    data: data
                }
                resolve(next())
            })
        })
    }
    await alioss_uploadfile()
}
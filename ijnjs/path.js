(function(root){
    /**
     * @class
     * https://docs.microsoft.com/zh-tw/dotnet/api/system.io.path.getdirectoryname
     * https://docs.microsoft.com/zh-tw/dotnet/api/system.io.path.getfilename
     * https://docs.microsoft.com/zh-tw/dotnet/api/system.io.path.getfilenamewithoutextension
     * 
     */
     function Path(){}

     /**
      * '/sdasd/asdgsdg' => '/sdasd
      * '/sdasd' => ''
      * '' => ''
      * '\sdasd\asdgsdg' => '\sdasd'
      * @param {string} path 
      * @returns {string}
      */
     Path.getDirectoryName = function (path){
         var i = path.length - 1
         while ( i > -1 ){
             if ( path[i] == '/' || path[i] == '\\' ){
                 return path.substring(0,i)
             }
             i--
         }
         return ''
     }
     /**
      * 'c:/sdasd/asdgsdg.txt' => asdgsdg.txt
      * c:/sdasd/asdgsdg => asdgsdg
      * c:/sdasd/ => ''
      * asdgsdg.txt => asdgsdg.txt
      * @param {string} path 
      * @returns {string}
      */
     Path.getFileName = function(path) {
         var i = path.length - 1
         while ( i > -1 ){
             if ( path[i] == '/' || path[i] == '\\' ){
                 return path.substring(i+1)
             }
             i--
         }
         return path
     }
     /**
      * @param {string} path 
      * @returns {string}
      * @see Path.getFileName
      */
     Path.getFileNameWithoutExtension = function (path){
         var i = path.length - 1
         var dot = -1
         while ( i > -1 ){
             if ( path[i] == '.' && dot == -1 ){
                 dot = i
             } else if ( path[i] == '/' || path[i] == '\\' ){
                 if ( dot == -1 )
                     return path.substring(i+1)
                 else 
                     return path.substring(i+1,dot)
             }
             i--
         }
         if (dot != -1 )
             return path.substring(0,dot)
         return path
     }
     /**
      * c:/asdf.txt => .txt
      * c:/asdf.com.txt => .txt
      * c:/asdf/asdf.txt => .txt
      * c:/asdf.com/asdf => ''
      * @param {string} path 
      * @returns {string}
      */
     Path.getExtension = function (path) {
         var i = path.length - 1
         while ( i > -1 ){
             if ( path[i] == '.'){
                 return path.substring(i)
             } else if ( path[i] == '/' || path[i] == '\\' ){
                 return ''
             }
             i--
         }
         return path
     }
     /**
      * asdf.txt => asdf.mov
      * asdf/asdf.txt => asdf/asdf.mov
      * asdf.com.txt => asdf.com.mov
      * asdf.com/asdf => asdf.com/asdf.mov
      * asdf.com/ => asdf.com/.mov
      * asdf => asdf.mov
      * asdf/ => asdf/.mov
      * @param {string} path 
      * @param {string?} ext .mov 包含. , 若 undefined, 則移除 (同等於 getFileNameWithoutExtension)
      * @returns 
      */
     Path.changeExtension = function (path,ext) {
         var i = path.length - 1
         while ( i > -1 ){
             if ( path[i] == '.' ){
                 return path.substring(0,i) + ext
             } else if ( path[i] == '/' || path[i] == '\\' ){
                 return path + ext
             }
             i--
         }
         return path
     }

     root.exports = Path
})(this)
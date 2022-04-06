import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function AlertInput(data, confirmFunc) {
  withReactContent(Swal).fire({
    ...data, 
    preConfirm: async (inputStr) => {
      // バリデーションチェック
      if (inputStr.length == 0) {
        return Swal.showValidationMessage('１文字以上入力してください')
      }

      //ローディングを表示させるために3秒スリープ
      var sleep = function (sec) {
        return new Promise(resolve => {
          setTimeout(resolve, sec * 1000)
        })
      }
      return sleep(1)

    },
    allowOutsideClick: function () {
      return !Swal.isLoading()
    }
  }).then((result) => {
    if (result.value) {
      confirmFunc(result)
    }
  }) 
}

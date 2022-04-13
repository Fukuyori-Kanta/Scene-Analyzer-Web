import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function AlertInput(data, confirmFunc) {
  withReactContent(Swal).fire({
    ...data, 
    allowOutsideClick: function () {
      return !Swal.isLoading()
    }
  }).then((result) => {
    if (result.value) {
      confirmFunc(result)
    }
  }) 
}

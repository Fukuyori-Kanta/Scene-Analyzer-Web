import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function AlertWarning(data, confirmFunc) {
  withReactContent(Swal).fire({
    ...data, icon: 'warning'
  }).then((result) => {
    if (result.value) {
      confirmFunc()
    }
  }) 
}
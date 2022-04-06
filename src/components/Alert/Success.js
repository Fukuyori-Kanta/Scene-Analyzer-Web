import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function AlertSuccess(data) {
  withReactContent(Swal).fire({
    ...data, icon: 'success'
  })
}
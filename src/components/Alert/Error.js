import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function AlertError(data) {
  withReactContent(Swal).fire({...data, icon: 'error'})
}

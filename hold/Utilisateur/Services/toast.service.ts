import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {


  constructor(private toastr: ToastrService) {

  }
  /**
   * Show success toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showSuccessToast(title: string = 'Succès', message: string = 'Opération effectuée avec succès') {
    this.toastr.success(message, title);
  }

  /**
   * Show info toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showInfoToast(title: string = 'Information', message: string) {
    this.toastr.info(message, title);
  }

  /**
   * Show warning toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showWarningToast(title: string = 'Attention', message: string = 'Veuillez vérifier vos informations') {
    this.toastr.warning(message, title);
  }

  /**
   * Show error toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showErrorToast(title: string = 'Erreur', message: string = 'Erreur lors du chargement des données') {
    this.toastr.error(message, title);
  }
}


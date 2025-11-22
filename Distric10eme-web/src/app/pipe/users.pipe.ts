import { Pipe, PipeTransform } from '@angular/core';
import { UtilisateurModel } from '../shared/Model/Utilisateur.model';

@Pipe({
    name: 'users',
    standalone: true
})
export class UsersPipe implements PipeTransform {
  transform(users: UtilisateurModel[], searchText: string): any[] {
    if (!users || !searchText) {
      return users;
    }
  
    const searchTextLower = this.removeAccents(searchText.trim().toLowerCase());
  

    return users.filter(user => {
      const fullName = `${user.prenomUser} ${user.nomUser}`.toLowerCase();
      return (
        (fullName.includes(searchTextLower)) ||
        (user.emailUser?.toLowerCase().includes(searchTextLower)) ||
        (user.adresseUser?.toLowerCase().includes(searchTextLower)) || 
        (user.telephoneUser?.toLowerCase().includes(searchTextLower)) || 
        (user.numeroPieceIdentiteUser?.toLowerCase().includes(searchTextLower)) || 
        (user.sexeUser?.toLowerCase().includes(searchTextLower)) 
      );
    });
  }
  
  private escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  
  private removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

}

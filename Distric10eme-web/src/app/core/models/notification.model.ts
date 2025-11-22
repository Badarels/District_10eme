export enum StatutNotification {
  EN_ATTENTE = 'EN_ATTENTE',
  ENVOYEE = 'ENVOYEE',
  ECHEC = 'ECHEC'
}

export interface Notification {
  id?: number;
  destinataireId: number;
  canal: string;
  message: string;
  dateEnvoi?: string;
  statut?: StatutNotification;
}


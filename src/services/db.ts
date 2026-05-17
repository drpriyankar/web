/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Database Service for Anandam Arogyam
// Handles Leads and Appointments

export interface Lead {
  id: string;
  name: string;
  phone: string;
  condition: string;
  source: string;
  timestamp: string;
  status: 'New' | 'In-Progress' | 'Closed';
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  clinicId: 'clinic1' | 'clinic2';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

class DBService {
  private leadsKey = 'anandam_leads';
  private appointmentsKey = 'anandam_appointments';

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(this.leadsKey)) {
      localStorage.setItem(this.leadsKey, JSON.stringify([
        { id: '1', name: 'Rahul Deshmukh', phone: '+91 98XXX XXXX1', condition: 'Slip Disc', source: 'Hero Form', timestamp: new Date().toISOString(), status: 'New' },
        { id: '2', name: 'Suman Kaur', phone: '+91 91XXX XXXX5', condition: 'Migraine', source: 'WhatsApp', timestamp: new Date().toISOString(), status: 'In-Progress' }
      ]));
    }
    if (!localStorage.getItem(this.appointmentsKey)) {
      localStorage.setItem(this.appointmentsKey, JSON.stringify([]));
    }
  }

  // Leads
  getLeads(): Lead[] {
    return JSON.parse(localStorage.getItem(this.leadsKey) || '[]');
  }

  addLead(lead: Omit<Lead, 'id' | 'timestamp' | 'status'>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'New'
    };
    leads.unshift(newLead);
    localStorage.setItem(this.leadsKey, JSON.stringify(leads));
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead['status']) {
    const leads = this.getLeads();
    const lead = leads.find(l => l.id === id);
    if (lead) {
      lead.status = status;
      localStorage.setItem(this.leadsKey, JSON.stringify(leads));
    }
  }

  // Appointments
  getAppointments(): Appointment[] {
    return JSON.parse(localStorage.getItem(this.appointmentsKey) || '[]');
  }

  addAppointment(app: Omit<Appointment, 'id' | 'status'>): Appointment {
    const apps = this.getAppointments();
    const newApp: Appointment = {
      ...app,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Scheduled'
    };
    apps.unshift(newApp);
    localStorage.setItem(this.appointmentsKey, JSON.stringify(apps));
    return newApp;
  }
}

export const dbService = new DBService();

import { VercelRequest, VercelResponse } from '@vercel/node';

interface FormData {
  recipient_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  recipient_email?: string;
  occasion?: string;
  season?: string;
  comforts?: string;
  card_message?: string;
  name_on_card: string;
  budget?: string;
  sender_name: string;
  sender_email: string;
  source_page?: string;
  form_type?: string;
  // Build Custom Kit fields
  items_eye_pillow?: boolean;
  items_balm?: boolean;
  items_journal?: boolean;
  items_custom_gift?: boolean;
  custom_gift_details?: string;
  custom_fabric?: string;
  fabric_theme?: string;
  special_requests?: string;
  custom_gift_budget?: string;
}

// Helper function to escape CSV fields
function escapeCsvField(field: string | null | undefined): string {
  if (!field) return '';
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

// Generate CSV content from form data
function generateCSV(formData: FormData): string {
  const rows = [
    // Header row
    [
      'Form Type',
      'Sender Name',
      'Sender Email',
      'Recipient Name',
      'Recipient Email',
      'Street Address',
      'City',
      'State',
      'ZIP Code',
      'Occasion',
      'Season/Situation',
      'Comforts',
      'Budget',
      'Card Message',
      'Name on Card',
      'Eye Pillow',
      'Balm',
      'Journal',
      'Custom Gift',
      'Custom Gift Details',
      'Custom Fabric',
      'Fabric Theme',
      'Special Requests',
      'Source Page',
      'Submission Date',
    ].join(','),
    
    // Data row
    [
      escapeCsvField(formData.form_type || 'standard'),
      escapeCsvField(formData.sender_name),
      escapeCsvField(formData.sender_email),
      escapeCsvField(formData.recipient_name),
      escapeCsvField(formData.recipient_email || ''),
      escapeCsvField(formData.address),
      escapeCsvField(formData.city),
      escapeCsvField(formData.state),
      escapeCsvField(formData.zip),
      escapeCsvField(formData.occasion || ''),
      escapeCsvField(formData.season || ''),
      escapeCsvField(formData.comforts || ''),
      escapeCsvField(formData.budget || formData.custom_gift_budget || ''),
      escapeCsvField(formData.card_message || ''),
      escapeCsvField(formData.name_on_card || ''),
      escapeCsvField(formData.items_eye_pillow ? 'Yes' : 'No'),
      escapeCsvField(formData.items_balm ? 'Yes' : 'No'),
      escapeCsvField(formData.items_journal ? 'Yes' : 'No'),
      escapeCsvField(formData.items_custom_gift ? 'Yes' : 'No'),
      escapeCsvField(formData.custom_gift_details || ''),
      escapeCsvField(formData.custom_fabric || ''),
      escapeCsvField(formData.fabric_theme || ''),
      escapeCsvField(formData.special_requests || ''),
      escapeCsvField(formData.source_page || ''),
      escapeCsvField(new Date().toISOString()),
    ].join(','),
  ];

  return rows.join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Allow both GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let formData: FormData;

    if (req.method === 'POST') {
      // POST: Get data from request body
      formData = req.body;
    } else {
      // GET: Get data from query parameters (base64 encoded JSON)
      const encoded = req.query.data as string;
      if (!encoded) {
        return res.status(400).json({ error: 'Missing form data parameter' });
      }
      try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        formData = JSON.parse(decoded);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid form data format' });
      }
    }

    // Validate required fields
    if (!formData.sender_email || !formData.sender_name || !formData.recipient_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate CSV
    const csvContent = generateCSV(formData);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `gathered-grace-order-${formData.recipient_name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}.csv`;

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send CSV file
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('Error generating CSV:', err);
    return res.status(500).json({ error: 'Failed to generate CSV' });
  }
}


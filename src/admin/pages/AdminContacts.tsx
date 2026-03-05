import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactsTable } from '../components/ContactsTable';

export default function AdminContacts() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contacts</h1>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="email_signup">Email Signups</TabsTrigger>
          <TabsTrigger value="discount_popup">Discount Popup</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ContactsTable />
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <ContactsTable category="orders" />
        </TabsContent>
        <TabsContent value="email_signup" className="mt-4">
          <ContactsTable leadType="email_signup" />
        </TabsContent>
        <TabsContent value="discount_popup" className="mt-4">
          <ContactsTable leadType="discount_popup" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

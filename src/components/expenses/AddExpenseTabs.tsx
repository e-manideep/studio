'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseForm } from './ExpenseForm';
import { CSVUpload } from './CSVUpload';
import { ImageUploadCard } from './ImageUploadCard';

export function AddExpenseTabs() {
  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="scan">Scan Receipt</TabsTrigger>
        <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="manual">
        <ExpenseForm />
      </TabsContent>
      <TabsContent value="scan">
        <ImageUploadCard />
      </TabsContent>
      <TabsContent value="upload">
        <CSVUpload />
      </TabsContent>
    </Tabs>
  );
}

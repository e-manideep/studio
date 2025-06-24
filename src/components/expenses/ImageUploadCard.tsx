'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/hooks/useAppContext';
import { ChangeEvent, useState, useTransition } from 'react';
import { Loader2, UploadCloud, FileImage, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { extractExpenseAction } from '@/lib/actions';

export function ImageUploadCard() {
  const { addExpense } = useAppContext();
  const { toast } = useToast();
  const [isProcessing, startProcessing] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setImageDataUri(null);
      return;
    };

    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ title: 'File too large', description: 'Please upload an image under 4MB.', variant: 'destructive' });
        return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Set data URI for sending to AI
    const dataReader = new FileReader();
    dataReader.onload = (e) => {
        setImageDataUri(e.target?.result as string);
    };
    dataReader.readAsDataURL(file);
  };

  const handleExtract = () => {
    if (!imageDataUri) {
        toast({ title: 'No image selected', description: 'Please select a receipt image first.', variant: 'destructive' });
        return;
    }
    
    startProcessing(async () => {
        const result = await extractExpenseAction(imageDataUri);
        if (result.error || !result.expense) {
            toast({ title: 'Extraction Failed', description: result.error || 'Could not extract details from receipt.', variant: 'destructive' });
        } else {
            addExpense(result.expense);
            toast({ title: 'Expense Added!', description: `Added "${result.expense.description}" for ₹${result.expense.amount} from your receipt.` });
            setPreviewUrl(null);
            setImageDataUri(null);
        }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan a Receipt</CardTitle>
        <CardDescription>Let AI read your receipt and add the expense for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-8 h-48 w-full text-center">
          {previewUrl ? (
            <div className='relative w-full h-full'>
              <Image src={previewUrl} alt="Receipt preview" layout="fill" objectFit="contain" />
            </div>
          ) : (
            <>
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Drop a receipt image here</p>
              <p className="text-xs text-muted-foreground">or click to browse</p>
            </>
          )}
        </div>
        <div className="flex gap-2">
            <div className='relative flex-grow'>
                <Input id="receipt-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={isProcessing} className="absolute inset-0 opacity-0 cursor-pointer"/>
                <Button asChild variant="outline" className='w-full' disabled={isProcessing}>
                    <div>
                        <FileImage className="mr-2 h-4 w-4" />
                        {previewUrl ? 'Change Image' : 'Select Image'}
                    </div>
                </Button>
            </div>
            <Button onClick={handleExtract} disabled={isProcessing || !imageDataUri}>
                {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                Extract & Add
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const fs = require('fs');
const file = 'src/components/store/CheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Remove state variables for screenshot
code = code.replace(
  "const [bkashTrxId, setBkashTrxId] = useState('');\n  const [bkashScreenshot, setBkashScreenshot] = useState<File | null>(null);\n  const [isUploading, setIsUploading] = useState(false);",
  "const [bkashTrxId, setBkashTrxId] = useState('');"
);

// 2. Update validation logic
code = code.replace(
  "if (paymentMethod === 'bkash' && !bkashTrxId && !bkashScreenshot) {\n      toast.error('Please provide either a Transaction ID or upload a screenshot.');\n      return;\n    }",
  "if (paymentMethod === 'bkash' && !bkashTrxId) {\n      toast.error('Please provide the Transaction ID or the Sender bKash Number.');\n      return;\n    }"
);

// 3. Remove screenshot upload logic
const uploadLogic = `let screenshotUrl = '';
      if (bkashScreenshot) {
        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', bkashScreenshot);
        uploadData.append('upload_preset', 'kwxslhnw');
        
        const res = await fetch('https://api.cloudinary.com/v1_1/dzsiqw51v/image/upload', {
          method: 'POST',
          body: uploadData
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error?.message || 'Failed to upload screenshot');
        }
        screenshotUrl = data.secure_url;
        setIsUploading(false);
      }`;

code = code.replace(uploadLogic, "");

// 4. Remove screenshot URL from DB save
code = code.replace(
  "bkashDetails: paymentMethod === 'bkash' ? {\n          transactionId: bkashTrxId,\n          screenshotUrl: screenshotUrl\n        } : null,",
  "bkashDetails: paymentMethod === 'bkash' ? {\n          transactionId: bkashTrxId\n        } : null,"
);

// 5. Remove setIsUploading(false) from catch block
code = code.replace("toast.error('Failed to place order. Please try again.');\n      setIsUploading(false);", "toast.error('Failed to place order. Please try again.');");

// 6. Update JSX Text and Input placeholder
const oldText = `<p className="text-[12px] text-on-surface-variant uppercase font-bold tracking-widest">
                          After sending money, provide EITHER the Transaction ID OR upload a screenshot:
                        </p>
                        
                        <input 
                          placeholder="TRANSACTION ID (e.g. 8XL...)" 
                          value={bkashTrxId} 
                          onChange={e => setBkashTrxId(e.target.value)} 
                          className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme" 
                        />
                        
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            id="bkash-screenshot"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                setBkashScreenshot(e.target.files[0]);
                              }
                            }}
                          />
                          <label htmlFor="bkash-screenshot" className="flex items-center justify-center gap-2 w-full bg-surface-container-highest border-2 border-dashed border-surface-bright p-[16px] text-[14px] font-bold text-on-surface-variant hover:text-on-surface hover:border-primary cursor-pointer transition-colors uppercase rounded-theme">
                            <Upload className="w-5 h-5" />
                            {bkashScreenshot ? bkashScreenshot.name : 'UPLOAD SCREENSHOT'}
                          </label>
                        </div>`;

const newText = `<p className="text-[12px] text-on-surface-variant uppercase font-bold tracking-widest mb-[8px]">
                          After sending money, provide the Transaction ID OR the bKash number you sent money from:
                        </p>
                        
                        <input 
                          placeholder="TRANSACTION ID OR SENDER NUMBER" 
                          value={bkashTrxId} 
                          onChange={e => setBkashTrxId(e.target.value)} 
                          className="w-full bg-surface border-2 border-surface-bright p-[16px] text-[14px] font-bold text-on-surface focus:border-primary outline-none transition-colors uppercase rounded-theme" 
                        />`;

code = code.replace(oldText, newText);

// 7. Revert the Place order button text logic
code = code.replace("{isSubmitting ? (isUploading ? 'UPLOADING...' : 'PROCESSING...') : 'PLACE ORDER'}", "{isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}");

fs.writeFileSync(file, code);


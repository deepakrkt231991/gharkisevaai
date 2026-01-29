'use server';
/**
 * @fileOverview The Certificate Authority - An AI agent for generating trust certificates.
 *
 * - generateTrustCertificate - A function to generate a 'Verified Seller Certificate'.
 * - CertificateInput - The input type for the function.
 * - CertificateOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CertificateInputSchema = z.object({
  ownerName: z.string().describe("The name of the property owner."),
  propertyId: z.string().describe("The unique ID of the property."),
  verificationDate: z.string().describe("The date the verification was completed (e.g., 'October 28, 2023')."),
});
export type CertificateInput = z.infer<typeof CertificateInputSchema>;

const CertificateOutputSchema = z.object({
  certificateUrl: z
    .string()
    .describe("The generated 'Verified Seller Certificate' as a data URI."),
});
export type CertificateOutput = z.infer<typeof CertificateOutputSchema>;


export async function generateTrustCertificate(input: CertificateInput): Promise<CertificateOutput> {
  return certificateGeneratorFlow(input);
}

const certificateGeneratorFlow = ai.defineFlow(
  {
    name: 'certificateGeneratorFlow',
    inputSchema: CertificateInputSchema,
    outputSchema: CertificateOutputSchema,
  },
  async ({ ownerName, propertyId, verificationDate }) => {
    
    // In a real scenario, you might have a more robust template.
    // This prompt is designed to be very specific to get a consistent output from a generative model.
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Create a highly professional, official-looking "Trust Certificate" for a home services app called "Ghar Ki Seva".

      **Design Specifications:**
      - **Layout:** Formal, centered, with a clean and elegant border.
      - **Background:** A very light beige (#F5F5DC) with a subtle, low-opacity "Ghar Ki Seva" logo as a watermark in the center.
      - **Color Scheme:** Use a deep, trustworthy blue for headings, black for body text, and a vibrant green for checkmarks.
      - **Fonts:** Use a classic serif font for headings (like 'Alegreya') and a clean sans-serif for body text (like 'PT Sans').
      - **Logo:** Place the official "Ghar Ki Seva" logo at the top center.

      **Certificate Content (Exact Text and Layout):**

      (Logo at Top Center)

      **Ghar Ki Seva - Trust Certificate**
      (A thin horizontal line)

      *प्रमाणित किया जाता है कि (This is to certify that):*
      **${ownerName}**

      *प्रॉपर्टी आईडी (Property ID):*
      **${propertyId}**

      ---

      **सत्यापन विवरण (Verification Status):**

      ✅ **आधार कार्ड (Aadhar Card):** सत्यापित (Verified)
      ✅ **पैन कार्ड (PAN Card):** सत्यापित (Verified)
      ✅ **बिजली/पानी बिल (Utility Bill):** सत्यापित (Verified)
      ✅ **प्रॉपर्टी मालिकाना हक (Property Ownership):** एडमिन द्वारा जांचा गया (Admin Reviewed)

      ---

      *यह यूजर 'Ghar Ki Seva' प्लेटफार्म का एक विश्वसनीय सदस्य है। इनकी प्रॉपर्टी के दस्तावेज हमारे सुरक्षित डेटाबेस में दर्ज हैं।*
      *(This user is a trusted member of the 'Ghar Ki Seva' platform. Their property documents are recorded in our secure database.)*

      ---

      *जारी करने की तिथि (Date of Issue):*
      **${verificationDate}**

      (At the bottom right, place a digital stamp or emblem that says "Ghar Ki Seva Digital Stamp" with a seal icon.)

      Generate this certificate as a high-resolution image.
      `,
    });

    if (!media || !media.url) {
      throw new Error('Certificate image generation failed.');
    }
    
    return {
      certificateUrl: media.url,
    };
  }
);

import { Coupon } from "@/types"
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"
import {toHTML} from "@portabletext/to-html"
interface Product {
  _id: string
  name: string
  slug: string
  price: number
  imageUrl?: string
  description?: string
}

interface NewsletterCampaignEmailProps {
  emailSubject: string
  emailHeading: string
  emailBody: any
  products: Product[]
  email:string
  campaignCode?: Coupon
  utmTerm?: string
  utmContent?: string
}
const COLORS = {
  green: "#4c9748",
  greenLight: "#6fbf73",
  bgMain: "#121212",
  bgSurface: "#1c1b1b",
  bgSurfaceAlt: "#171717",
  text: "#ffffff",
  textMuted: "#b5b5b5",
  divider: "#2a2a2a",
}


const baseUrl =  "https://hydroocann.com"

export default function NewsletterCampaignEmail ({
  emailSubject = "Speciální nabídka jen pro vás",
  emailHeading = "Objevte naše nejlepší produkty",
  emailBody,
  products = [],
  campaignCode,
  utmTerm,
  utmContent,
  email
}: NewsletterCampaignEmailProps) {
  const buildProductUrl = (slug: string) => {
    const params = new URLSearchParams()
    if (campaignCode) params.append("code", campaignCode.code)
    if (utmTerm) params.append("utm_term", utmTerm)
    if (utmContent) params.append("utm_content", utmContent)
    params.append("utm_source", "newsletter")
    params.append("utm_medium", "email")

    return `${baseUrl}/produkty/${slug}?${params.toString()}`
  }
  const html = toHTML(emailBody, {
  components: {
    list: {
      bullet: ({ children }) =>
        `<ul style="margin:16px 0;padding-left:20px;color:${COLORS.text};">${children}</ul>`,
      number: ({ children }) =>
        `<ol style="margin:16px 0;padding-left:20px;color:${COLORS.text};">${children}</ol>`,
    },

    listItem: {
      bullet: ({ children }) =>
        `<li style="margin-bottom:8px;">${children}</li>`,
      number: ({ children }) =>
        `<li style="margin-bottom:8px;">${children}</li>`,
    },

    block: {
      h1: ({ children }) =>
        `<h1 style="font-size:24px;font-weight:bold;margin:16px 0;color:${COLORS.text};">${children}</h1>`,
      h2: ({ children }) =>
        `<h2 style="font-size:20px;font-weight:bold;margin:14px 0;color:${COLORS.greenLight};">${children}</h2>`,
      h3: ({ children }) =>
        `<h3 style="font-size:18px;font-weight:bold;margin:12px 0;color:${COLORS.text};">${children}</h3>`,
      normal: ({ children }) =>
        `<p style="margin:8px 0;line-height:1.6;color:${COLORS.text};">${children}</p>`,
      blockquote: ({ children }) =>
        `<blockquote style="
          border-left:4px solid ${COLORS.green};
          padding-left:12px;
          margin:16px 0;
          color:${COLORS.textMuted};
        ">${children}</blockquote>`,
    },

    marks: {
      strong: ({ children }) =>
        `<strong style="color:${COLORS.text};font-weight:bold;">${children}</strong>`,
      em: ({ children }) =>
        `<em style="color:${COLORS.text};font-style:italic;">${children}</em>`,
      link: ({ children, value }) =>
        `<a href="${value?.href}" style="color:${COLORS.greenLight};text-decoration:underline;">${children}</a>`,
    },
  },
})

  return (
    <Html>
      <Head />
      <Preview>{emailSubject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
                src={baseUrl+"/_next/image?url=%2images%2Flogo.png&w=640&q=75"}
            />
          </Section>

          {/* Hero Section */}
          <Section style={hero}>
            <Heading style={h1}>{emailHeading}</Heading>
             <Section>
  <div
  dangerouslySetInnerHTML={{__html: html}}
  >

  </div>
</Section>
            {campaignCode && (
              <Section style={couponSection}>
                <Text style={couponLabel}>Váš slevový kód:</Text>
                <Text style={couponCode}>{campaignCode.code}</Text>
              </Section>
            )}
          </Section>

          <Hr style={divider} />

          {/* Products Section */}
          <Section style={productsSection}>
            <Heading as="h2" style={h2}>
              Vybrané produkty
            </Heading>

            {products.map((product, index) => (
              <React.Fragment key={product._id || index}>
                <Section style={productCard}>
                  <Row>
                    <Column style={productImageColumn}>
                      {product.imageUrl ? (
                        <Img src={product.imageUrl} alt={product.name} style={productImage} />
                      ) : (
                        <div style={placeholderImage}>
                          <Text style={placeholderText}>Obrázek</Text>
                        </div>
                      )}
                    </Column>
                    <Column style={productDetailsColumn}>
                      <Heading as="h3" style={productName}>
                        {product.name}
                      </Heading>
                      {product.description && <Text style={productDescription}>{product.description}</Text>}
                      <Text style={productPrice}>
                        {new Intl.NumberFormat("cs-CZ", {
                          style: "currency",
                          currency: "CZK",
                          minimumFractionDigits: 0,
                        }).format(product.price)}
                      </Text>
                      <Button href={buildProductUrl(product.slug)} style={button}>
                        Zobrazit produkt
                      </Button>
                    </Column>
                  </Row>
                </Section>
                {index < products.length - 1 && <Hr style={productDivider} />}
              </React.Fragment>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
  <Text style={footerText}>
    Děkujeme, že jste s námi!
  </Text>

  <Text style={footerText}>
    <Link href={`${baseUrl}/kontakt`} style={link}>
      Kontakt
    </Link>
    {" • "}
    <Link href={`${baseUrl}/obchodni-podminky`} style={link}>
      Obchodní podmínky
    </Link>
    {" • "}
    <Link href={`${baseUrl}/signout?email=${email}`} style={link}>
      Odhlásit odběr
    </Link>
  </Text>

  <Text style={{ ...footerText, fontSize: "12px" }}>
    © {new Date().getFullYear()} Váš obchod. Všechna práva vyhrazena.
  </Text>
</Section>

        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: COLORS.bgMain,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: COLORS.bgSurface,
  maxWidth: "600px",
  margin: "0 auto",
  color: COLORS.text,
}

const header = {
  backgroundColor: COLORS.bgSurfaceAlt,
  padding: "24px 32px",
  textAlign: "center" as const,
}

const hero = {
  padding: "48px 32px 32px",
  textAlign: "center" as const,
}

const h1 = {
  color: COLORS.text,
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "16px",
}

const h2 = {
  color: COLORS.greenLight,
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "24px",
  textAlign: "center" as const,
}

const divider = {
  borderColor: COLORS.divider,
  margin: "32px 0",
}

const productName = {
  color: COLORS.text,
  fontSize: "20px",
  fontWeight: "600",
}

const productDescription = {
  color: COLORS.textMuted,
  fontSize: "14px",
}

const productPrice = {
  color: COLORS.greenLight,
  fontSize: "22px",
  fontWeight: "700",
}

const button = {
  backgroundColor: COLORS.green,
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
}

const footer = {
  backgroundColor: COLORS.bgSurfaceAlt,
  padding: "32px",
  textAlign: "center" as const,
}

const footerText = {
  color: COLORS.textMuted, // světle šedá
  fontSize: "14px",
  margin: "0 0 16px",
}


// Styles

const couponSection = {
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px auto 0",
  maxWidth: "300px",
  textAlign: "center" as const,
}

const couponLabel = {
  color: "#737373",
  fontSize: "14px",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
}

const couponCode = {
  color: "#171717",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
  letterSpacing: "2px",
}
const productsSection = {
  padding: "0 32px 32px",
}

const productCard = {
  margin: "0 0 24px",
}

const productImageColumn = {
  width: "180px",
  verticalAlign: "top" as const,
  paddingRight: "20px",
}

const productImage = {
  width: "180px",
  height: "180px",
  objectFit: "cover" as const,
  borderRadius: "8px",
}

const placeholderImage = {
  width: "180px",
  height: "180px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const placeholderText = {
  color: "#a3a3a3",
  fontSize: "14px",
  margin: "0",
}

const productDetailsColumn = {
  verticalAlign: "top" as const,
}


const productDivider = {
  borderColor: "#f5f5f5",
  margin: "24px 0",
}

const link = {
  color: COLORS.greenLight,
  textDecoration: "underline",
}

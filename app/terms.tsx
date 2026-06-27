// app/terms.tsx
import React from 'react'
import { ScrollView, View } from 'react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import { useTranslation } from '@/lib/i18n'

export default function TermsScreen() {
  const { t } = useTranslation()

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('legal.termsTitle')} />}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}>
        <Typography variant="heading2" className="mb-3">Terms of Service</Typography>
        <Typography variant="body-sm" color="muted" className="mb-6">
          Last updated: {new Date().toISOString().split('T')[0]}
        </Typography>

        <Section title="Acceptance">
          By using GBTL you agree to these Terms. If you do not agree, do not use the app.
        </Section>

        <Section title="Account">
          You sign in with Google. You are responsible for keeping your Google account secure. You
          may delete your account at any time from the Cart screen.
        </Section>

        <Section title="Purchases">
          Orders are processed by Stripe. Prices, taxes and delivery fees are shown before purchase.
          All sales are final unless required by law.
        </Section>

        <Section title="Acceptable use">
          Do not abuse the service, scrape content, or impersonate others.
        </Section>

        <Section title="Liability">
          GBTL is provided &quot;as is&quot;. We are not liable for indirect damages to the extent allowed
          by law.
        </Section>

        <Section title="Changes">
          We may update these Terms. Continued use means acceptance.
        </Section>

        <Section title="Contact">
          terms@gbtl.app
        </Section>

        <Typography variant="body-sm" color="muted" className="mt-4">
          Note: replace this placeholder with reviewed legal text before publishing.
        </Typography>
      </ScrollView>
    </ScreenWrapper>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-5">
      <Typography variant="heading3" className="mb-2">{title}</Typography>
      <Typography variant="body" color="muted">{children}</Typography>
    </View>
  )
}

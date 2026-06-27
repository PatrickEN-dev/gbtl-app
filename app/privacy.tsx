// app/privacy.tsx
import React from 'react'
import { ScrollView, View } from 'react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import { useTranslation } from '@/lib/i18n'

export default function PrivacyScreen() {
  const { t } = useTranslation()

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('legal.privacyTitle')} />}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}>
        <Typography variant="heading2" className="mb-3">Privacy Policy</Typography>
        <Typography variant="body-sm" color="muted" className="mb-6">
          Last updated: {new Date().toISOString().split('T')[0]}
        </Typography>

        <Section title="Data we collect">
          We collect the minimum needed to provide the GBTL service: your name, email and avatar from
          Google when you sign in, items added to cart and wishlist, and payment information processed
          securely by Stripe.
        </Section>

        <Section title="How we use it">
          To authenticate you, fulfill orders, and contact you about your purchases. We do not sell
          your data to third parties.
        </Section>

        <Section title="Storage and security">
          Authentication tokens are stored on your device in the platform secure storage. Cart and
          wishlist data lives on-device until you sign in, where it is synced to your account.
        </Section>

        <Section title="Third-party services">
          - Google (authentication){'\n'}
          - Stripe (payments){'\n'}
          - Expo Notifications (push)
        </Section>

        <Section title="Your rights">
          You can request deletion of your account and associated data at any time from the Cart
          screen → &quot;Delete account&quot; link, or by emailing privacy@gbtl.app.
        </Section>

        <Section title="Contact">
          For any privacy question, email privacy@gbtl.app.
        </Section>

        <Typography variant="body-sm" color="muted" className="mt-4">
          Note: replace this placeholder with your reviewed legal text before publishing. A hosted copy
          (e.g. on a public URL) is also required by the Play Store.
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

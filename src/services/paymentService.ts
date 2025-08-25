// src/services/paymentService.ts
import { supabase } from '../lib/supabaseClient';

// Assuming these types are defined in types/payment.ts
// For this example, we'll define a basic structure here.
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  durationInHours?: number; // Added this property
  optimizations: number;
  scoreChecks: number;
  linkedinMessages: number | typeof Infinity;
  guidedBuilds: number;
  tag: string;
  tagColor: string;
  gradient: string;
  icon: string;
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
  optimizationsUsed: number;
  optimizationsTotal: number;
  paymentId: string | null;
  couponUsed: string | null;
  scoreChecksUsed: number;
  scoreChecksTotal: number;
  linkedinMessagesUsed: number;
  linkedinMessagesTotal: number;
  guidedBuildsUsed: number;
  guidedBuildsTotal: number;
}

// Define the credit types and their corresponding database fields
type CreditType = 'optimizations' | 'score_checks' | 'linkedin_messages' | 'guided_builds';

class PaymentService {
  // Define plans data directly in the service
  private plans: SubscriptionPlan[] = [
    {
      id: 'career_pro_max',
      name: 'Career Pro Max',
      price: 1999,
      duration: 'One-time Purchase',
      durationInHours: 8760, // 365 days
      optimizations: 50,
      scoreChecks: 50,
      linkedinMessages: Infinity,
      guidedBuilds: 5,
      tag: 'Ultimate Value',
      tagColor: 'text-purple-800 bg-purple-100',
      gradient: 'from-purple-500 to-indigo-500',
      icon: 'crown',
      features: [
        '✅ 50 Resume Optimizations',
        '✅ 50 Score Checks',
        '✅ Unlimited LinkedIn Messages',
        '✅ 5 Guided Resume Builds',
        '✅ Priority Support',
      ],
      popular: true,
    },
    {
      id: 'career_boost_plus',
      name: 'Career Boost+',
      price: 1499,
      duration: 'One-time Purchase',
      durationInHours: 8760, // 365 days
      optimizations: 30,
      scoreChecks: 30,
      linkedinMessages: Infinity,
      guidedBuilds: 3,
      tag: 'Best Seller',
      tagColor: 'text-blue-800 bg-blue-100',
      gradient: 'from-blue-500 to-cyan-500',
      icon: 'zap',
      features: [
        '✅ 30 Resume Optimizations',
        '✅ 30 Score Checks',
        '✅ Unlimited LinkedIn Messages',
        '✅ 3 Guided Resume Builds',
        '✅ Standard Support',
      ],
    },
    {
      id: 'pro_resume_kit',
      name: 'Pro Resume Kit',
      price: 999,
      duration: 'One-time Purchase',
      durationInHours: 8760, // 365 days
      optimizations: 20,
      scoreChecks: 20,
      linkedinMessages: 100,
      guidedBuilds: 2,
      tag: 'Great Start',
      tagColor: 'text-green-800 bg-green-100',
      gradient: 'from-green-500 to-emerald-500',
      icon: 'rocket',
      features: [
        '✅ 20 Resume Optimizations',
        '✅ 20 Score Checks',
        '✅ 100 LinkedIn Messages',
        '✅ 2 Guided Resume Builds',
        '✅ Email Support',
      ],
    },
    {
      id: 'smart_apply_pack',
      name: 'Smart Apply Pack',
      price: 499,
      duration: 'One-time Purchase',
      durationInHours: 8760, // 365 days
      optimizations: 10,
      scoreChecks: 10,
      linkedinMessages: 50,
      guidedBuilds: 1,
      tag: 'Quick Boost',
      tagColor: 'text-yellow-800 bg-yellow-100',
      gradient: 'from-yellow-500 to-orange-500',
      icon: 'target',
      features: [
        '✅ 10 Resume Optimizations',
        '✅ 10 Score Checks',
        '✅ 50 LinkedIn Messages',
        '✅ 1 Guided Resume Build',
        '✅ Basic Support',
      ],
    },
    {
      id: 'resume_fix_pack',
      name: 'Resume Fix Pack',
      price: 199,
      duration: 'One-time Purchase',
      durationInHours: 8760, // 365 days
      optimizations: 5,
      scoreChecks: 2,
      linkedinMessages: 0,
      guidedBuilds: 0,
      tag: 'Essential',
      tagColor: 'text-red-800 bg-red-100',
      gradient: 'from-red-500 to-pink-500',
      icon: 'wrench',
      features: [
        '✅ 5 Resume Optimizations',
        '✅ 2 Score Checks',
        '❌ LinkedIn Messages',
        '❌ Guided Builds',
        '❌ Priority Support',
      ],
    },
    {
      id: 'lite_check',
      name: 'Lite Check',
      price: 99,
      duration: 'One-time Purchase', // While it's a "Trial", for consistency with DB date calculation, give it a duration.
      durationInHours: 168, // 7 days (7 * 24 hours)
      optimizations: 2,
      scoreChecks: 2,
      linkedinMessages: 10,
      guidedBuilds: 0,
      tag: 'Trial',
      tagColor: 'text-gray-800 bg-gray-100',
      gradient: 'from-gray-500 to-gray-700',
      icon: 'check_circle',
      features: [
        '✅ 2 Resume Optimizations',
        '✅ 2 Score Checks',
        '✅ 10 LinkedIn Messages',
        '❌ Guided Builds',
        '❌ Priority Support',
      ],
    },
  ];

  // Define add-ons data directly in the service
  private addOns = [
    {
      id: 'jd_optimization_single',
      name: 'JD-Based Optimization (1x)',
      price: 49,
      type: 'optimization',
      quantity: 1,
    },
    {
      id: 'guided_resume_build_single',
      name: 'Guided Resume Build (1x)',
      price: 99,
      type: 'guided_build',
      quantity: 1,
    },
    {
      id: 'resume_score_check_single',
      name: 'Resume Score Check (1x)',
      price: 19,
      type: 'score_check',
      quantity: 1,
    },
    {
      id: 'linkedin_messages_50',
      name: 'LinkedIn Messages (50x)',
      price: 29,
      type: 'linkedin_messages',
      quantity: 50,
    },
    {
      id: 'linkedin_optimization_single',
      name: 'LinkedIn Optimization (1x Review)',
      price: 199,
      type: 'linkedin_optimization',
      quantity: 1,
    },
    {
      id: 'resume_guidance_session',
      name: 'Resume Guidance Session (Live)',
      price: 299,
      type: 'guidance_session',
      quantity: 1,
    },
    // NEW ADD-ON: Single JD-Based Optimization Purchase
    {
      id: 'jd_optimization_single_purchase',
      name: 'JD-Based Optimization (1 Use)',
      price: 49, // Example price in Rupees
      type: 'optimization',
      quantity: 1,
    },
    // NEW ADD-ON: Single Guided Resume Build Purchase
    {
      id: 'guided_resume_build_single_purchase',
      name: 'Guided Resume Build (1 Use)',
      price: 99, // Example price in Rupees
      type: 'guided_build',
      quantity: 1,
    },
    // NEW ADD-ON: Single Resume Score Check Purchase
    {
      id: 'resume_score_check_single_purchase',
      name: 'Resume Score Check (1 Use)',
      price: 19,
      type: 'score_check',
      quantity: 1,
    },
    // NEW ADD-ON: LinkedIn Messages 50 Purchase
    {
      id: 'linkedin_messages_50_purchase',
      name: 'LinkedIn Messages (50 Uses)',
      price: 29,
      type: 'linkedin_messages',
      quantity: 50,
    },
  ];

  getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  getAddOns(): any[] {
    return this.addOns;
  }

  getPlanById(id: string): SubscriptionPlan | undefined {
    return this.plans.find((p) => p.id === id);
  }

  getAddOnById(id: string): any | undefined {
    return this.addOns.find((a) => a.id === id);
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    console.log('PaymentService: Fetching user subscription for userId:', userId);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active') // Ensure we only fetch active subscriptions
        .order('created_at', { ascending: false }) // Get the latest one if multiple
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('PaymentService: Error fetching user subscription:', error);
        return null;
      }

      if (!data) {
        console.log('PaymentService: No active subscription found for user:', userId);
        return null;
      }

      // Map Supabase data to your Subscription interface
      const subscription: Subscription = {
        id: data.id,
        userId: data.user_id,
        planId: data.plan_id,
        status: data.status,
        startDate: data.start_date,
        endDate: data.end_date,
        optimizationsUsed: data.optimizations_used,
        optimizationsTotal: data.optimizations_total,
        paymentId: data.payment_id,
        couponUsed: data.coupon_used,
        scoreChecksUsed: data.score_checks_used,
        scoreChecksTotal: data.score_checks_total,
        linkedinMessagesUsed: data.linkedin_messages_used,
        linkedinMessagesTotal: data.linkedin_messages_total,
        guidedBuildsUsed: data.guided_builds_used,
        guidedBuildsTotal: data.guided_builds_total,
      };
      console.log('PaymentService: Successfully fetched user subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('PaymentService: Unexpected error in getUserSubscription:', error);
      return null;
    }
  }

  /**
   * Refactored generic method to use a specific credit type.
   * @param userId The ID of the user.
   * @param creditField The name of the credit field to update (e.g., 'optimizations', 'score_checks').
   * @returns An object with success status and remaining credits.
   */
  private async useCredit(
    userId: string,
    creditField: CreditType
  ): Promise<{ success: boolean; remaining?: number; error?: string }> {
    const totalField = `${creditField}_total`;
    const usedField = `${creditField}_used`;

    console.log(`PaymentService: Attempting to use ${creditField} for userId:`, userId);
    try {
      const { data: currentSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select(`id, ${usedField}, ${totalField}`)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error(`PaymentService: Error fetching current subscription for ${creditField}:`, fetchError);
        return { success: false, error: 'Failed to fetch current subscription.' };
      }

      if (!currentSubscription) {
        console.warn(`PaymentService: No active subscription found for ${creditField} for userId:`, userId);
        return { success: false, error: 'No active subscription found.' };
      }

      const newCreditsUsed = (currentSubscription[usedField] || 0) + 1;
      const remaining = currentSubscription[totalField] - newCreditsUsed;

      if (remaining < 0 && currentSubscription[totalField] !== Infinity) {
        console.warn(`PaymentService: ${creditField} credits exhausted for userId:`, userId);
        return { success: false, error: 'Credits exhausted.' };
      }

      console.log(`PaymentService: Updating ${usedField} for subscription ${currentSubscription.id} from ${currentSubscription[usedField]} to ${newCreditsUsed}`);
      const updateData: { [key: string]: any } = {
        [usedField]: newCreditsUsed,
        updated_at: new Date().toISOString(),
      };
      
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', currentSubscription.id);

      if (updateError) {
        console.error(`PaymentService: Error updating ${usedField}:`, updateError);
        return { success: false, error: 'Failed to update credit usage.' };
      }

      console.log(`PaymentService: Successfully used ${creditField} for userId: ${userId}. Remaining: ${remaining}`);
      return { success: true, remaining: remaining };
    } catch (error) {
      console.error(`PaymentService: Unexpected error in useCredit (${creditField}):`, error);
      return { success: false, error: 'An unexpected error occurred while using credits.' };
    }
  }

  // Exposed public methods for using credits, now calling the generic private method
  async useOptimization(userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
    return this.useCredit(userId, 'optimizations');
  }

  async useScoreCheck(userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
    return this.useCredit(userId, 'score_checks');
  }

  async useLinkedInMessage(userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
    return this.useCredit(userId, 'linkedin_messages');
  }

  async useGuidedBuild(userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
    return this.useCredit(userId, 'guided_builds');
  }


  async activateFreeTrial(userId: string): Promise<void> {
    console.log('PaymentService: Attempting to activate free trial for userId:', userId);
    try {
      // Check if user already has an active or past free trial
      const { data: existingTrial, error: fetchError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('plan_id', 'lite_check') // Assuming 'lite_check' is the free trial plan
        .maybeSingle();

      if (fetchError) {
        console.error('PaymentService: Error checking for existing free trial:', fetchError);
        throw new Error('Failed to check for existing free trial.');
      }

      if (existingTrial) {
        console.log('PaymentService: User already has a free trial, skipping activation.');
        return;
      }

      // Get the 'lite_check' plan details
      const freePlan = this.getPlanById('lite_check');
      if (!freePlan) {
        throw new Error('Free trial plan configuration not found.');
      }

      // Create a new subscription for the free trial
      const { error: insertError } = await supabase.from('subscriptions').insert({
        user_id: userId,
        plan_id: freePlan.id,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7-day free trial
        optimizations_used: 0,
        optimizations_total: freePlan.optimizations,
        score_checks_used: 0,
        score_checks_total: freePlan.scoreChecks,
        linkedin_messages_used: 0,
        linkedin_messages_total: freePlan.linkedinMessages,
        guided_builds_used: 0,
        guided_builds_total: freePlan.guidedBuilds,
        payment_id: null, // No payment for free trial
        coupon_used: 'free_trial',
      });

      if (insertError) {
        console.error('PaymentService: Error activating free trial:', insertError);
        throw new Error('Failed to activate free trial.');
      }
      console.log('PaymentService: Free trial activated successfully for userId:', userId);
    } catch (error) {
      console.error('PaymentService: Unexpected error in activateFreeTrial:', error);
      throw error;
    }
  }

  // NEW: Private method to validate coupon on the server
  private async validateCouponServer(couponCode: string, userId: string, accessToken: string): Promise<{ isValid: boolean; message: string }> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ couponCode, userId }),
      });

      const result = await response.json();
      if (!response.ok) {
        // If the response is not OK, it means the Edge Function itself returned an error (e.g., 400, 500)
        // This usually indicates a problem with the request or the function's execution.
        console.error('Error from validate-coupon Edge Function:', result.message || response.statusText);
        return { isValid: false, message: result.message || 'Failed to validate coupon on server.' };
      }
      return result; // This will contain { isValid: boolean, message: string }
    } catch (error) {
      console.error('Network error during coupon validation:', error);
      return { isValid: false, message: 'Network error during coupon validation. Please try again.' };
    }
  }

  // MODIFIED: applyCoupon now performs server-side validation
  async applyCoupon(planId: string, couponCode: string, userId: string | null): Promise<{ couponApplied: string | null; discountAmount: number; finalAmount: number; error?: string; isValid: boolean; message: string }> {
    const plan = this.getPlanById(planId);
    if (!plan && planId !== 'addon_only_purchase') { // Allow addon_only_purchase for coupon application
      return { couponApplied: null, discountAmount: 0, finalAmount: 0, error: 'Invalid plan selected', isValid: false, message: 'Invalid plan selected' };
    }

    // Perform server-side validation first
    if (userId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.access_token) {
        return { couponApplied: null, discountAmount: 0, finalAmount: 0, error: 'Authentication required for coupon validation', isValid: false, message: 'Authentication required for coupon validation' };
      }
      const serverValidation = await this.validateCouponServer(couponCode, userId, session.access_token);
      if (!serverValidation.isValid) {
        return { couponApplied: null, discountAmount: 0, finalAmount: 0, error: serverValidation.message, isValid: false, message: serverValidation.message };
      }
    }

    let originalPrice = (plan?.price || 0) * 100; // Convert to paise, or 0 if addon_only
    if (planId === 'addon_only_purchase') {
      // For addon_only_purchase, the original price is the sum of selected add-ons.
      // This logic needs to be handled on the frontend or passed as an argument.
      // For now, assume originalPrice is 0 for coupon calculation if it's an add-on only purchase.
      originalPrice = 0; // Coupons typically apply to plans, not individual add-ons unless specified.
    }

    let discountAmount = 0;
    let finalAmount = originalPrice;
    let message = 'Coupon applied successfully!';

    const normalizedCoupon = couponCode.toLowerCase().trim();

    if (normalizedCoupon === 'fullsupport' && planId === 'career_pro_max') {
      discountAmount = originalPrice;
      finalAmount = 0;
    } else if (normalizedCoupon === 'first100' && planId === 'lite_check') {
      discountAmount = originalPrice;
      finalAmount = 0;
    } else if (normalizedCoupon === 'first500' && planId === 'lite_check') {
      // This coupon requires a backend check for usage limit.
      // For frontend simulation, we'll assume it's valid if it reaches here.
      // The actual check will happen in the Supabase Edge Function.
      discountAmount = Math.floor(originalPrice * 0.98);
      finalAmount = originalPrice - discountAmount;
    } else if (normalizedCoupon === 'worthyone' && planId === 'career_pro_max') {
      discountAmount = Math.floor(originalPrice * 0.5);
      finalAmount = originalPrice - discountAmount;
    } else {
      return { couponApplied: null, discountAmount: 0, finalAmount: originalPrice, error: 'Invalid coupon code or not applicable to selected plan', isValid: false, message: 'Invalid coupon code or not applicable to selected plan' };
    }

    return { couponApplied: normalizedCoupon, discountAmount, finalAmount, isValid: true, message: message };
  }

  async processPayment(
    paymentData: { planId: string; amount: number; currency: string },
    userEmail: string,
    userName: string,
    accessToken: string,
    couponCode?: string,
    walletDeduction?: number,
    addOnsTotal?: number,
    selectedAddOns?: { [key: string]: number }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('PaymentService: Calling create-order Edge Function...');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          planId: paymentData.planId,
          amount: paymentData.amount, // Amount in paise
          couponCode: couponCode,
          walletDeduction: walletDeduction, // In paise
          addOnsTotal: addOnsTotal, // In paise
          selectedAddOns: selectedAddOns,
        }),
      });

      const orderResult = await response.json();

      if (!response.ok) {
        console.error('PaymentService: Error from create-order:', orderResult.error);
        return { success: false, error: orderResult.error || 'Failed to create order.' };
      }

      const { orderId, amount, keyId, currency, transactionId } = orderResult;

      return new Promise((resolve) => {
        const options = {
          key: keyId,
          amount: amount, // Amount in paise
          currency: currency,
          name: 'PrimoBoost AI',
          description: 'Resume Optimization Plan',
          order_id: orderId,
          handler: async (response: any) => {
            try {
              console.log('PaymentService: Calling verify-payment Edge Function...');
              const verifyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  transactionId: transactionId,
                }),
              });

              const verifyResult = await verifyResponse.json();

              if (verifyResponse.ok && verifyResult.success) {
                resolve({ success: true });
              } else {
                console.error('PaymentService: Error from verify-payment:', verifyResult.error);
                resolve({ success: false, error: verifyResult.error || 'Payment verification failed.' });
              }
            } catch (error) {
              console.error('PaymentService: Error during payment verification:', error);
              resolve({ success: false, error: 'An error occurred during payment verification.' });
            }
          },
          prefill: {
            name: userName,
            email: userEmail,
          },
          theme: {
            color: '#4F46E5', // Indigo-600
          },
          modal: {
            ondismiss: () => {
              console.log('PaymentService: Payment modal dismissed.');
              resolve({ success: false, error: 'Payment cancelled by user.' });
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      });
    } catch (error) {
      console.error('PaymentService: Error in processPayment:', error);
      return { success: false, error: (error as Error).message || 'Failed to process payment.' };
    }
  }

  async processFreeSubscription(
    planId: string,
    userId: string,
    couponCode?: string,
    addOnsTotal?: number,
    selectedAddOns?: { [key: string]: number },
    originalPlanAmount?: number, // In paise
    walletDeduction?: number // In paise
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('PaymentService: Processing free subscription...');

      // Get the plan details
      const plan = this.getPlanById(planId);
      if (!plan) {
        throw new Error('Invalid plan selected for free subscription.');
      }

      // Add this validation check for durationInHours
      if (typeof plan.durationInHours !== 'number' || isNaN(plan.durationInHours) || !isFinite(plan.durationInHours)) {
        console.error('PaymentService: Invalid durationInHours detected for plan:', plan);
        throw new Error('Invalid plan duration configuration. Please contact support.');
      }

      // Create a pending transaction record for the free plan
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: userId,
          plan_id: planId === 'addon_only_purchase' ? null : planId,
          status: 'success', // Mark as success directly for free plans
          amount: originalPlanAmount || 0, // Original plan amount in paise
          currency: 'INR',
          coupon_code: couponCode,
          discount_amount: originalPlanAmount || 0, // Full discount for free plans
          final_amount: 0, // Final amount is 0
          purchase_type: planId === 'addon_only_purchase' ? 'addon_only' : (Object.keys(selectedAddOns || {}).length > 0 ? 'plan_with_addons' : 'plan'),
          wallet_deduction_amount: walletDeduction || 0,
          payment_id: 'FREE_PLAN_ACTIVATION',
          order_id: 'FREE_PLAN_ORDER',
        })
        .select('id')
        .single();

      if (transactionError) {
        console.error('PaymentService: Error inserting free transaction:', transactionError);
        throw new Error('Failed to record free plan activation.');
      }
      const transactionId = transaction.id;

      // Process add-on credits if any
      if (selectedAddOns && Object.keys(selectedAddOns).length > 0) {
        console.log(`[${new Date().toISOString()}] - Processing add-on credits for user: ${userId}`);
        for (const addOnKey in selectedAddOns) {
          const quantity = selectedAddOns[addOnKey];
          const addOn = this.getAddOnById(addOnKey);
          if (!addOn) {
            console.error(`[${new Date().toISOString()}] - Add-on with ID ${addOnKey} not found in configuration. Skipping.`);
            continue;
          }

          const { data: addonType, error: addonTypeError } = await supabase
            .from("addon_types")
            .select("id")
            .eq("type_key", addOn.type)
            .single();

          if (addonTypeError || !addonType) {
            console.error(`[${new Date().toISOString()}] - Error finding addon_type for key ${addOn.type}:`, addonTypeError);
            continue;
          }

          const { error: creditInsertError } = await supabase
            .from("user_addon_credits")
            .insert({
              user_id: userId,
              addon_type_id: addonType.id,
              quantity_purchased: quantity,
              quantity_remaining: quantity,
              payment_transaction_id: transactionId,
            });

          if (creditInsertError) {
            console.error(`[${new Date().toISOString()}] - Error inserting add-on credits for ${addOn.type}:`, creditInsertError);
          }
        }
      }

      // Create subscription if it's a plan activation (not just add-ons)
      if (planId && planId !== 'addon_only_purchase') {
        const linkedinMessagesTotalValue = plan.linkedinMessages === Infinity ? 999999999 : plan.linkedinMessages;
        const { data: subscription, error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan_id: planId,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + (plan.durationInHours * 60 * 60 * 1000)).toISOString(),
            optimizations_used: 0,
            optimizations_total: plan.optimizations,
            score_checks_used: 0,
            score_checks_total: plan.scoreChecks,
            linkedin_messages_used: 0,
            linkedin_messages_total: linkedinMessagesTotalValue,
            guided_builds_used: 0,
            guided_builds_total: plan.guidedBuilds,
            payment_id: 'FREE_PLAN_ACTIVATION',
            coupon_used: couponCode,
          })
          .select()
          .single();

        if (subscriptionError) {
          console.error('PaymentService: Subscription creation error for free plan:', subscriptionError);
          throw new Error('Failed to create subscription for free plan.');
        }

        // Update payment transaction with subscription ID
        const { error: updateSubscriptionIdError } = await supabase
          .from("payment_transactions")
          .update({ subscription_id: subscription.id })
          .eq("id", transactionId);

        if (updateSubscriptionIdError) {
          console.error("Error updating payment transaction with subscription_id for free plan:", updateSubscriptionIdError);
        }
      }

      // Handle wallet deduction for free plans
      if (walletDeduction && walletDeduction > 0) {
        const { error: walletError } = await supabase
          .from("wallet_transactions")
          .insert({
            user_id: userId,
            type: "purchase_use",
            amount: -(walletDeduction), // Store as negative for deduction
            status: "completed",
            transaction_ref: `free_plan_deduction_${transactionId}`,
            redeem_details: {
              plan_id: planId,
              original_amount: originalPlanAmount ? originalPlanAmount / 100 : 0,
              addons_purchased: selectedAddOns,
            },
          });

        if (walletError) {
          console.error(`[${new Date().toISOString()}] - Wallet deduction recording error for free plan:`, walletError);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('PaymentService: Error in processFreeSubscription:', error);
      return { success: false, error: (error as Error).message || 'Failed to activate free subscription.' };
    }
  }
}

export const paymentService = new PaymentService();


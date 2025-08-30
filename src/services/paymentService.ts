// src/services/paymentService.ts
import { supabase } from '../lib/supabaseClient';

// Assuming these types are defined in types/payment.ts
// For this example, we'll define a basic structure here.
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // This will be the offer price
  mrp: number; // New: Manufacturer's Recommended Price
  discountPercentage: number; // New: Calculated discount percentage
  duration: string;
  optimizations: number;
  scoreChecks: number;
  linkedinMessages: number; // Changed from typeof Infinity to number
  guidedBuilds: number;
  tag: string;
  tagColor: string;
  gradient: string;
  icon: string;
  features: string[];
  popular?: boolean;
  durationInHours: number; // Added this property
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
type CreditType = 'optimization' | 'score_check' | 'linkedin_messages' | 'guided_build'; // Changed to singular forms

class PaymentService {
  // Define plans data directly in the service
  private plans: SubscriptionPlan[] = [
    {
      id: 'career_pro_max',
      name: 'Career Pro Max',
      price: 2299, // Offer Price
      mrp: 10000, // MRP
      discountPercentage: 77.01, // (10000 - 2299) / 10000 * 100
      duration: 'One-time Purchase',
      optimizations: 50,
      scoreChecks: 50,
      linkedinMessages: 500, // Fixed count
      guidedBuilds: 5,
      tag: 'Ultimate Value',
      tagColor: 'text-purple-800 bg-purple-100',
      gradient: 'from-purple-500 to-indigo-500',
      icon: 'crown',
      features: [
        '✅ 50 Resume Optimizations',
        '✅ 50 Score Checks',
        '✅ 500 LinkedIn Messages',
        '✅ 5 Guided Resume Builds',
        '✅ Priority Support',
      ],
      popular: false, // Will be "Best Value"
      durationInHours: 8760, // 365 days
    },
    {
      id: 'career_boost_plus',
      name: 'Career Boost+',
      price: 1699, // Offer Price
      mrp: 7500, // MRP
      discountPercentage: 77.34, // (7500 - 1699) / 7500 * 100
      duration: 'One-time Purchase',
      optimizations: 30,
      scoreChecks: 30,
      linkedinMessages: 300, // Fixed count
      guidedBuilds: 3,
      tag: 'Best Seller',
      tagColor: 'text-blue-800 bg-blue-100',
      gradient: 'from-blue-500 to-cyan-500',
      icon: 'zap',
      features: [
        '✅ 30 Resume Optimizations',
        '✅ 30 Score Checks',
        '✅ 300 LinkedIn Messages',
        '✅ 3 Guided Resume Builds',
        '✅ Standard Support',
      ],
      popular: true, // Will be "Most Popular"
      durationInHours: 8760, // 365 days
    },
    {
      id: 'pro_resume_kit',
      name: 'Pro Resume Kit',
      price: 1199, // Offer Price
      mrp: 5000, // MRP
      discountPercentage: 76.02, // (5000 - 1199) / 5000 * 100
      duration: 'One-time Purchase',
      optimizations: 20,
      scoreChecks: 20,
      linkedinMessages: 100, // Fixed count
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
      popular: false,
      durationInHours: 8760, // 365 days
    },
    {
      id: 'smart_apply_pack',
      name: 'Smart Apply Pack',
      price: 599, // Offer Price
      mrp: 2500, // MRP
      discountPercentage: 76.04, // (2500 - 599) / 2500 * 100
      duration: 'One-time Purchase',
      optimizations: 10,
      scoreChecks: 10,
      linkedinMessages: 50, // Fixed count
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
      popular: false,
      durationInHours: 8760, // 365 days
    },
    {
      id: 'resume_fix_pack',
      name: 'Resume Fix Pack',
      price: 249, // Offer Price
      mrp: 999, // MRP
      discountPercentage: 75.07, // (999 - 249) / 999 * 100
      duration: 'One-time Purchase',
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
      popular: false,
      durationInHours: 8760, // 365 days
    },
    {
      id: 'lite_check',
      name: 'Lite Check',
      price: 129, // Offer Price
      mrp: 499, // MRP
      discountPercentage: 74.15, // (499 - 129) / 499 * 100
      duration: 'One-time Purchase',
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
      popular: false,
      durationInHours: 168, // 7 days (7 * 24 hours)
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
      price: 19, // Example price in Rupees
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
      price: 9,
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
      // Fetch ALL active subscriptions for the user
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false }); // Order by creation date, but fetch all

      if (error) {
        console.error('PaymentService: Error fetching user subscriptions:', error.message, error.details);
        return null;
      }

      // Initialize cumulative totals from all active subscriptions
      let cumulativeOptimizationsUsed = 0;
      let cumulativeOptimizationsTotal = 0;
      let cumulativeScoreChecksUsed = 0;
      let cumulativeScoreChecksTotal = 0;
      let cumulativeLinkedinMessagesUsed = 0;
      let cumulativeLinkedinMessagesTotal = 0;
      let cumulativeGuidedBuildsUsed = 0;
      let cumulativeGuidedBuildsTotal = 0;

      let latestSubscriptionId: string | null = null;
      let latestPlanId: string | null = null;
      let latestStatus: string = 'inactive';
      let latestStartDate: string = '';
      let latestEndDate: string = '';
      let latestPaymentId: string | null = null;
      let latestCouponUsed: string | null = null;

      if (subscriptions && subscriptions.length > 0) {
        // Sum up credits from all active subscriptions
        subscriptions.forEach(sub => {
          cumulativeOptimizationsUsed += sub.optimizations_used;
          cumulativeOptimizationsTotal += sub.optimizations_total;
          cumulativeScoreChecksUsed += sub.score_checks_used;
          cumulativeScoreChecksTotal += sub.score_checks_total;
          cumulativeLinkedinMessagesUsed += sub.linkedin_messages_used;
          cumulativeLinkedinMessagesTotal += sub.linkedin_messages_total;
          cumulativeGuidedBuildsUsed += sub.guided_builds_used;
          cumulativeGuidedBuildsTotal += sub.guided_builds_total;
        });

        // For the purpose of returning a single 'currentSubscription' object,
        // we'll use details from the most recent active subscription.
        const latestSub = subscriptions[0]; // Since it's ordered by created_at descending
        latestSubscriptionId = latestSub.id;
        latestPlanId = latestSub.plan_id;
        latestStatus = latestSub.status;
        latestStartDate = latestSub.start_date;
        latestEndDate = latestSub.end_date;
        latestPaymentId = latestSub.payment_id;
        latestCouponUsed = latestSub.coupon_used;
      }

      // Fetch ALL add-on credits for the user
      const { data: addonCreditsData, error: addonCreditsError } = await supabase
        .from('user_addon_credits')
        .select(`
          addon_type_id,
          quantity_purchased,
          quantity_remaining,
          addon_types(type_key)
        `)
        .eq('user_id', userId); // REMOVED .gt('quantity_remaining', 0) filter

      console.log('PaymentService: Fetched raw add-on credits data:', addonCreditsData); // NEW LOG: Inspect raw data

      if (addonCreditsError) {
        console.error('PaymentService: Error fetching add-on credits:', addonCreditsError.message, addonCreditsError.details);
      }

      // Initialize aggregated add-on credits (keys match addon_types.type_key)
      const aggregatedAddonCredits: { [key: string]: { total: number; used: number } } = {
        optimization: { total: 0, used: 0 },
        score_check: { total: 0, used: 0 },
        linkedin_messages: { total: 0, used: 0 },
        guided_build: { total: 0, used: 0 },
        // Add other addon types here if they exist in your addon_types table
      };

      if (addonCreditsData) {
        addonCreditsData.forEach(credit => {
          const typeKey = (credit.addon_types as { type_key: string }).type_key;
          if (aggregatedAddonCredits[typeKey]) { // Ensure typeKey exists in our aggregation object
            aggregatedAddonCredits[typeKey].total += credit.quantity_purchased; // Sum purchased
            aggregatedAddonCredits[typeKey].used += (credit.quantity_purchased - credit.quantity_remaining); // Sum used
          }
        });
      }

      console.log('PaymentService: Aggregated add-on credits:', aggregatedAddonCredits);

      // Combine cumulative plan credits with aggregated add-on credits
      const finalOptimizationsTotal = cumulativeOptimizationsTotal + aggregatedAddonCredits.optimization.total;
      const finalScoreChecksTotal = cumulativeScoreChecksTotal + aggregatedAddonCredits.score_check.total;
      const finalLinkedinMessagesTotal = cumulativeLinkedinMessagesTotal + aggregatedAddonCredits.linkedin_messages.total;
      const finalGuidedBuildsTotal = cumulativeGuidedBuildsTotal + aggregatedAddonCredits.guided_build.total;

      // Also update the USED counts with add-on used counts
      const finalOptimizationsUsed = cumulativeOptimizationsUsed + aggregatedAddonCredits.optimization.used;
      const finalScoreChecksUsed = cumulativeScoreChecksUsed + aggregatedAddonCredits.score_check.used;
      const finalLinkedinMessagesUsed = cumulativeLinkedinMessagesUsed + aggregatedAddonCredits.linkedin_messages.used;
      const finalGuidedBuildsUsed = cumulativeGuidedBuildsUsed + aggregatedAddonCredits.guided_build.used;


      // If no active subscriptions AND no add-on credits, then return null
      const hasAnyCredits = finalOptimizationsTotal > 0 || finalScoreChecksTotal > 0 || finalLinkedinMessagesTotal > 0 || finalGuidedBuildsTotal > 0;

      if (!hasAnyCredits) {
        console.log('PaymentService: No active subscription or add-on credits found for user:', userId);
        return null;
      }

      // Construct the final currentSubscription object
      const currentSubscription: Subscription = {
        id: latestSubscriptionId || 'virtual-addon-subscription', // Use latest sub ID or a virtual one
        userId: userId,
        planId: latestPlanId || 'addon_only', // Use latest plan ID or indicate add-on only
        status: latestStatus,
        startDate: latestStartDate || new Date().toISOString(),
        endDate: latestEndDate || new Date(8640000000000000).toISOString(), // Far future date for "active" if only add-ons
        optimizationsUsed: finalOptimizationsUsed, // Use final used count
        optimizationsTotal: finalOptimizationsTotal,
        paymentId: latestPaymentId,
        couponUsed: latestCouponUsed,
        scoreChecksUsed: finalScoreChecksUsed, // Use final used count
        scoreChecksTotal: finalScoreChecksTotal,
        linkedinMessagesUsed: finalLinkedinMessagesUsed, // Use final used count
        linkedinMessagesTotal: finalLinkedinMessagesTotal,
        guidedBuildsUsed: finalGuidedBuildsUsed, // Use final used count
        guidedBuildsTotal: finalGuidedBuildsTotal,
      };

      // If there are add-on credits but no actual subscription, ensure status is 'active'
      if (subscriptions.length === 0 && hasAnyCredits) {
          currentSubscription.status = 'active';
          currentSubscription.endDate = new Date(8640000000000000).toISOString(); // Set to far future
      }

      console.log('PaymentService: Final combined subscription and add-on credits object:', currentSubscription);
      console.log('PaymentService: Successfully fetched combined subscription and add-on credits:', currentSubscription);
      return currentSubscription;
    } catch (error: any) {
      console.error('PaymentService: Unexpected error in getUserSubscription:', error.message);
      return null;
    }
  }

  /**
   * Refactored generic method to use a specific credit type.
   * @param userId The ID of the user.
   * @param creditField The name of the credit field to update (e.g., 'optimization', 'score_check').
   * @returns An object with success status and remaining credits.
   */
  private async useCredit(
    userId: string,
    creditField: CreditType
  ): Promise<{ success: boolean; remaining?: number; error?: string }> {
    // Note: totalField and usedField are derived from the plural forms in the DB schema
    // This means we need to map the singular creditField to its plural DB column name
    const dbCreditFieldMap: { [key in CreditType]: string } = {
      'optimization': 'optimizations',
      'score_check': 'score_checks',
      'linkedin_messages': 'linkedin_messages',
      'guided_build': 'guided_builds',
    };

    const dbCreditFieldName = dbCreditFieldMap[creditField];
    if (!dbCreditFieldName) {
      console.error(`PaymentService: Invalid creditField provided: ${creditField}`);
      return { success: false, error: 'Invalid credit type.' };
    }

    const totalField = `${dbCreditFieldName}_total`;
    const usedField = `${dbCreditFieldName}_used`;

    console.log(`PaymentService: Attempting to use ${creditField} (DB field: ${dbCreditFieldName}) for userId:`, userId);
    try {
      // --- START: Prioritize add-on credits ---
      const { data: addonCredits, error: addonError } = await supabase
        .from('user_addon_credits')
        .select(`id, quantity_remaining, addon_types(type_key)`)
        .eq('user_id', userId)
        .gt('quantity_remaining', 0)
        .order('purchased_at', { ascending: true }); // Use oldest available add-on credit

      if (addonError) {
        console.error(`PaymentService: Error fetching add-on credits for ${creditField}:`, addonError.message, addonError.details);
        // Do not return here, proceed to check subscriptions if add-on fetch fails
      }

      // Find add-on credit matching the singular creditField (type_key)
      const relevantAddon = addonCredits?.find(credit => (credit.addon_types as { type_key: string }).type_key === creditField);

      if (relevantAddon && relevantAddon.quantity_remaining > 0) {
        const newRemaining = relevantAddon.quantity_remaining - 1;
        console.log(`PaymentService: Debugging relevantAddon:`, relevantAddon);
console.log(`PaymentService: Debugging relevantAddon.quantity_remaining:`, relevantAddon?.quantity_remaining);

        console.log(`PaymentService: Found add-on credit ${relevantAddon.id}. Current remaining: ${relevantAddon.quantity_remaining}. New remaining: ${newRemaining}`); // NEW LOG
        const { error: updateAddonError } = await supabase
          .from('user_addon_credits')
          .update({ quantity_remaining: newRemaining })
          .eq('id', relevantAddon.id);

        if (updateAddonError) {
          console.error(`PaymentService: CRITICAL ERROR updating add-on credit usage for ${creditField}:`, updateAddonError.message, updateAddonError.details); // MODIFIED LOG
          return { success: false, error: 'Failed to update add-on credit usage.' };
        }
        console.log(`PaymentService: Successfully updated add-on credit ${relevantAddon.id} to ${newRemaining} remaining.`); // NEW LOG
        // Re-calculate total remaining across all subscriptions and add-ons for the return value
        const updatedSubscriptionState = await this.getUserSubscription(userId);
        const totalRemaining = updatedSubscriptionState ? (updatedSubscriptionState as any)[`${dbCreditFieldName}Total`] - (updatedSubscriptionState as any)[`${dbCreditFieldName}Used`] : 0;
        console.log(`PaymentService: After update, calculated total remaining: ${totalRemaining}`); // NEW LOG
        return { success: true, remaining: totalRemaining };
      }
      // --- END: Prioritize add-on credits ---


      // --- START: Fallback to subscription credits if add-ons are exhausted or not found ---
      const { data: activeSubscriptions, error: fetchError } = await supabase
        .from('subscriptions')
        .select(`id, ${usedField}, ${totalField}`)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: true }); // Order by creation date to use oldest first

      if (fetchError) {
        console.error(`PaymentService: Error fetching active subscriptions for ${creditField}:`, fetchError.message, fetchError.details);
        return { success: false, error: 'Failed to fetch active subscriptions.' };
      }

      let usedFromSubscription = false;
      let remainingInSubscription = 0;
      for (const sub of activeSubscriptions || []) {
        const currentUsed = sub[usedField] || 0;
        const currentTotal = sub[totalField] || 0;
        if (currentUsed < currentTotal) {
          const newUsed = currentUsed + 1;
          remainingInSubscription = currentTotal - newUsed;

          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ [usedField]: newUsed, updated_at: new Date().toISOString() })
            .eq('id', sub.id);

          if (updateError) {
            console.error(`PaymentService: Error updating ${usedField} for subscription ${sub.id}:`, updateError.message, updateError.details);
            return { success: false, error: 'Failed to update credit usage in subscription.' };
          }
          console.log(`PaymentService: Successfully used 1 credit from subscription ${sub.id} for ${creditField}. Remaining: ${remainingInSubscription}`);
          usedFromSubscription = true;
          break; // Credit used, exit loop
        }
      }

      if (usedFromSubscription) {
        // Re-calculate total remaining across all subscriptions and add-ons for the return value
        const updatedSubscriptionState = await this.getUserSubscription(userId);
        const totalRemaining = updatedSubscriptionState ? (updatedSubscriptionState as any)[`${dbCreditFieldName}Total`] - (updatedSubscriptionState as any)[`${dbCreditFieldName}Used`] : 0;
        return { success: true, remaining: totalRemaining };
      }
      // --- END: Fallback to subscription credits ---

      console.warn(`PaymentService: No active subscription or add-on credits found for ${creditField} for userId:`, userId);
      return { success: false, error: 'No active subscription or add-on credits found.' };

    } catch (error: any) {
      console.error(`PaymentService: Unexpected error in useCredit (${creditField}):`, error.message);
      return { success: false, error: 'An unexpected error occurred while using credits.' };
    }
  }

  // Exposed public methods for using credits, now calling the generic private method
  async useOptimization(userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
    return this.useCredit(userId, 'optimization'); // Changed to singular
  }

  async useScoreCheck(userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
    return this.useCredit(userId, 'score_check'); // Changed to singular
  }

  async useLinkedInMessage(userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
    return this.useCredit(userId, 'linkedin_messages');
  }

  async useGuidedBuild(userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
    return this.useCredit(userId, 'guided_build'); // Changed to singular
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
        console.error('PaymentService: Error checking for existing free trial:', fetchError.message, fetchError.details);
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
        console.error('PaymentService: Error activating free trial:', insertError.message, insertError.details);
        throw new Error('Failed to activate free trial.');
      }
      console.log('PaymentService: Free trial activated successfully for userId:', userId);
    } catch (error: any) {
      console.error('PaymentService: Unexpected error in activateFreeTrial:', error.message);
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
    } catch (error: any) {
      console.error('Network error during coupon validation:', error.message);
      return { isValid: false, message: 'Network error during coupon validation. Please try again.' };
    }
  }

  // MODIFIED: applyCoupon now performs server-side validation and includes VNKR50%
  async applyCoupon(planId: string, couponCode: string, userId: string | null): Promise<{ couponApplied: string | null; discountAmount: number; finalAmount: number; error?: string; isValid: boolean; message: string }> {
    const plan = this.getPlanById(planId);
    if (!plan && planId !== 'addon_only_purchase') {
      return { couponApplied: null, discountAmount: 0, finalAmount: 0, error: 'Invalid plan selected', isValid: false, message: 'Invalid plan selected' };
    }

    // Perform server-side validation first
    if (userId) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session || !session.access_token) {
        return { couponApplied: null, discountAmount: 0, finalAmount: 0, error: 'Authentication required for coupon validation', isValid: false, message: 'Authentication required for coupon validation' };
      }
      const serverValidation = await this.validateCouponServer(couponCode, userId, session.access_token);
      if (!serverValidation.isValid) {
        return { couponApplied: null, discountAmount: 0, finalAmount: 0, error: serverValidation.message, isValid: false, message: serverValidation.message };
      }
    }

    let originalPrice = (plan?.price || 0) * 100; // Convert to paise, or 0 if addon_only
    if (planId === 'addon_only_purchase') {
      originalPrice = 0;
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
      discountAmount = Math.floor(originalPrice * 0.98);
      finalAmount = originalPrice - discountAmount;
    } else if (normalizedCoupon === 'worthyone' && planId === 'career_pro_max') {
      discountAmount = Math.floor(originalPrice * 0.5);
      finalAmount = originalPrice - discountAmount;
    }
    // NEW COUPON LOGIC: VNKR50% for career_pro_max
    else if (normalizedCoupon === 'vnkr50%' && planId === 'career_pro_max') {
      discountAmount = Math.floor(originalPrice * 0.5); // 50% off
      finalAmount = originalPrice - discountAmount;
      message = 'Vinayaka Chavithi Offer applied! 50% off!';
    }
    // NEW COUPON LOGIC: VNK50 for career_pro_max
    else if (normalizedCoupon === 'vnk50' && planId === 'career_pro_max') {
      discountAmount = Math.floor(originalPrice * 0.5); // 50% off
      finalAmount = originalPrice - discountAmount;
      message = 'VNK50 coupon applied! 50% off!';
    }
    else {
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
        console.error('PaymentService: Error from create-order:', orderResult.error || response.statusText);
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
                console.error('PaymentService: Error from verify-payment:', verifyResult.error || verifyResponse.statusText);
                resolve({ success: false, error: verifyResult.error || 'Payment verification failed.' });
              }
            } catch (error: any) {
              console.error('PaymentService: Error during payment verification:', error.message);
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
    } catch (error: any) {
      console.error('PaymentService: Error in processPayment:', error.message);
      return { success: false, error: error.message || 'Failed to process payment.' };
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
        console.error('PaymentService: Error inserting free transaction:', transactionError.message, transactionError.details);
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
            console.error(`[${new Date().toISOString()}] - Error finding addon_type for key ${addOn.type}:`, addonTypeError.message, addonTypeError.details);
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
            console.error(`[${new Date().toISOString()}] - Error inserting add-on credits for ${addOn.type}:`, creditInsertError.message, creditInsertError.details);
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
          console.error('PaymentService: Subscription creation error for free plan:', subscriptionError.message, subscriptionError.details);
          throw new Error('Failed to create subscription for free plan.');
        }

        // Update payment transaction with subscription ID
        const { error: updateSubscriptionIdError } = await supabase
          .from("payment_transactions")
          .update({ subscription_id: subscription.id })
          .eq("id", transactionId);

        if (updateSubscriptionIdError) {
          console.error("Error updating payment transaction with subscription_id for free plan:", updateSubscriptionIdError.message, updateSubscriptionIdError.details);
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
          console.error(`[${new Date().toISOString()}] - Wallet deduction recording error for free plan:`, walletError.message, walletError.details);
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('PaymentService: Error in processFreeSubscription:', error.message);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();

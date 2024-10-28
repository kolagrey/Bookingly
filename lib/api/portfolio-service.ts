import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type PortfolioItem } from '@/types/database'

const supabase = createClientComponentClient()

export const portfolioService = {
  async getExpertPortfolio(expertId: string) {
    const { data } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('expert_id', expertId)
      .order('created_at', { ascending: false })
    return data || []
  },

  async addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(item)
      .select()
      .single()
    return { data, error }
  },

  async updatePortfolioItem(
    id: string,
    updates: Partial<PortfolioItem>
  ) {
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deletePortfolioItem(id: string) {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id)
    return { error }
  },
}
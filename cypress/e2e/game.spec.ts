describe('五子棋游戏 E2E 测试', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('游戏界面加载', () => {
    it('应显示游戏标题', () => {
      cy.get('h1').should('contain.text', '五子棋')
      cy.get('.subtitle').should('contain.text', '水墨丹青')
    })

    it('应显示 Canvas 棋盘', () => {
      cy.get('canvas#game-board')
        .should('be.visible')
        .and('have.attr', 'width', '600')
        .and('have.attr', 'height', '600')
    })

    it('应显示难度选择按钮', () => {
      cy.get('[data-difficulty="easy"]').should('contain.text', '简单')
      cy.get('[data-difficulty="medium"]').should('contain.text', '中等')
      cy.get('[data-difficulty="hard"]').should('contain.text', '困难')
    })

    it('应显示游戏控制按钮', () => {
      cy.get('#undo-btn').should('be.visible').and('be.disabled')
      cy.get('#new-game-btn').should('be.visible').and('not.be.disabled')
    })

    it('应显示初始状态文本', () => {
      cy.get('#status-text').should('contain.text', '黑棋先行')
    })
  })

  describe('难度切换', () => {
    it('默认应选中中等难度', () => {
      cy.get('[data-difficulty="medium"]').should('have.class', 'active')
      cy.get('[data-difficulty="easy"]').should('not.have.class', 'active')
      cy.get('[data-difficulty="hard"]').should('not.have.class', 'active')
    })

    it('点击简单按钮应切换到简单难度', () => {
      cy.get('[data-difficulty="easy"]').click()
      cy.get('[data-difficulty="easy"]').should('have.class', 'active')
      cy.get('[data-difficulty="medium"]').should('not.have.class', 'active')
    })

    it('点击困难按钮应切换到困难难度', () => {
      cy.get('[data-difficulty="hard"]').click()
      cy.get('[data-difficulty="hard"]').should('have.class', 'active')
      cy.get('[data-difficulty="medium"]').should('not.have.class', 'active')
    })
  })

  describe('玩家落子', () => {
    it('点击棋盘应落下黑棋并更新状态', () => {
      cy.get('canvas#game-board').click(300, 300)
      cy.get('#status-text').should('not.contain.text', '黑棋先行')
    })

    it('落子后应启用悔棋按钮', () => {
      cy.get('canvas#game-board').click(300, 300)
      cy.get('#undo-btn').should('not.be.disabled')
    })
  })

  describe('新游戏功能', () => {
    it('点击新游戏按钮应重置游戏', () => {
      // 先落一子
      cy.get('canvas#game-board').click(300, 300)
      cy.get('#status-text').should('not.contain.text', '黑棋先行')

      // 点击新游戏
      cy.get('#new-game-btn').click()

      // 验证重置
      cy.get('#status-text').should('contain.text', '黑棋先行')
      cy.get('#undo-btn').should('be.disabled')
    })
  })
})

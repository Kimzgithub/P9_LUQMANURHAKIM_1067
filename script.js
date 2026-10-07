/* =========================================
   WARUNG ICE CREAM (DARK CHOCO EDITION)
========================================= */

$(document).ready(function() {


    const produkData = [
        { id: 1, nama: 'Dark Choco Gelato', harga: 18000, kategori: 'es-krim', icon: '🍨', desc: 'Gelato cokelat pekat premium', badge: 'Best Seller', badgeType: 'hot' },
        { id: 2, nama: 'Choco Hazelnut', harga: 16000, kategori: 'es-krim', icon: '🍦', desc: 'Paduan cokelat dan kacang hazelnut', badge: 'Favorit', badgeType: '' },
        { id: 3, nama: 'Moka Karamel Es Krim', harga: 15000, kategori: 'es-krim', icon: '🍦', desc: 'Kopi moka dengan saus karamel', badge: '', badgeType: '' },
        { id: 4, nama: 'Choco Mint Classic', harga: 16000, kategori: 'es-krim', icon: '🍨', desc: 'Cokelat segar dengan sensasi mint', badge: 'Baru', badgeType: '' },
        { id: 5, nama: 'Sundae Choco Lava', harga: 28000, kategori: 'sundae', icon: '🍧', desc: 'Sundae dengan lelehan lava cokelat', badge: 'Best Seller', badgeType: 'hot' },
        { id: 6, nama: 'Brownie Fudge Sundae', harga: 30000, kategori: 'sundae', icon: '🍮', desc: 'Potongan brownie & saus fudge', badge: '', badgeType: '' },
        { id: 7, nama: 'Sundae Choco Crunch', harga: 27000, kategori: 'sundae', icon: '🍧', desc: 'Taburan choco chip renyah', badge: 'Favorit', badgeType: '' },
        { id: 8, nama: 'Belgian Choco Shake', harga: 22000, kategori: 'minuman', icon: '🥤', desc: 'Milkshake cokelat Belgia dingin', badge: '', badgeType: '' },
        { id: 9, nama: 'Double Choco Frappe', harga: 25000, kategori: 'minuman', icon: '🧋', desc: 'Frappe cokelat ganda blended', badge: 'Baru', badgeType: '' },
        { id: 10, nama: 'Hot Cocoa Marshmallow', harga: 20000, kategori: 'minuman', icon: '☕', desc: 'Cokelat panas dengan marshmallow', badge: '', badgeType: '' },
        { id: 11, nama: 'Iced Mocha Macchiato', harga: 23000, kategori: 'minuman', icon: '🥤', desc: 'Kopi moka macchiato dingin', badge: '', badgeType: '' },
        { id: 12, nama: 'Choco Cola Float', harga: 24000, kategori: 'minuman', icon: '🍹', desc: 'Kola dingin dengan es krim cokelat', badge: 'Best Seller', badgeType: 'hot' }
    ];

    let cart = []; 
    let currentFilter = 'all'; 
    let searchKeyword = ''; 
    
    function renderProduk() {
        const $grid =$('#produkGrid');
        $grid.empty();

        const filtered = produkData.filter(function(p) {
            const matchKategori = currentFilter === 'all' || p.kategori === currentFilter;
            const matchSearch = p.nama.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                                p.desc.toLowerCase().includes(searchKeyword.toLowerCase());
            return matchKategori && matchSearch;
        });

        if (filtered.length === 0) {
            $grid.html(`
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3.5rem; color: var(--border-color); margin-bottom: 20px; display: block;"></i>
                    <h3 style="font-weight: 600; margin-bottom: 8px;">Produk tidak ditemukan</h3>
                    <p style="font-size: 0.9rem;">Coba kata kunci atau kategori lain</p>
                </div>
            `);
            return;
        }

        filtered.forEach(function(p) {
            const badgeHtml = p.badge ? `<div class="produk-badge ${p.badgeType}">${p.badge}</div>` : '';
            const card = `
                <div class="produk-card" data-id="${p.id}" data-kategori="${p.kategori}">
                    ${badgeHtml}
                    <div class="produk-img">${p.icon}</div>
                    <div class="produk-info">
                        <h3>${p.nama}</h3>
                        <p class="desc">${p.desc}</p>
                        <div class="produk-footer">
                            <div class="produk-price">
                                Rp ${p.harga.toLocaleString('id-ID')}
                                <small>per porsi</small>
                            </div>
                            <button class="btn-add-cart" data-id="${p.id}" title="Tambah ke keranjang">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            $grid.append(card);
        });
    }

    /* Event Listeners */
    $('.nav-link').click(function() {
        $('.nav-link').removeClass('active');$(this).addClass('active');
        currentFilter = $(this).data('filter');
        $('.filter-btn').removeClass('active');$(`.filter-btn[data-cat="${currentFilter}"]`).addClass('active');
        renderProduk();
    });

    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');$(this).addClass('active');
        currentFilter = $(this).data('cat');
        $('.nav-link').removeClass('active');$(`.nav-link[data-filter="${currentFilter}"]`).addClass('active');
        renderProduk();
    });

    $('#searchProduk').on('input', function() {
        searchKeyword = $(this).val();
        renderProduk();
    });

    $(document).on('click', '.btn-add-cart', function(e) {
        e.stopPropagation();
        const id = $(this).data('id');
        const produk = produkData.find(p => p.id === id);
        if (!produk) return;

        const existing = cart.find(item => item.id === id);
        if (existing) existing.qty += 1;
        else cart.push({ id: produk.id, nama: produk.nama, harga: produk.harga, icon: produk.icon, qty: 1 });
        
        updateCartUI();
        showToast(`${produk.icon} ${produk.nama} ditambahkan!`);
        
        $(this).css('transform', 'rotate(90deg) scale(1.3)');
        setTimeout(() => $(this).css('transform', ''), 300);$('#cartBadge').css('transform', 'scale(1.4)');
        setTimeout(() => $('#cartBadge').css('transform', 'scale(1)'), 200);
    });

    function updateCartUI() {
        const $cartItems =$('#cartItems');
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        let totalHarga = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);

        $('#cartBadge').text(totalQty);
        
        if (cart.length === 0) {
            $cartItems.html(`
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang masih kosong</p>
                    <small>Yuk pilih cokelat favoritmu!</small>
                </div>
            `);
            $('#cartTotal').text('Rp 0');
            return;
        }

        let html = '';
        cart.forEach(function(item) {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-icon">${item.icon}</div>
                    <div class="cart-item-info">
                        <h5>${item.nama}</h5>
                        <div class="price">Rp ${(item.harga * item.qty).toLocaleString('id-ID')}</div>
                        <div class="qty-control">
                            <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        $cartItems.html(html);

        if (totalHarga > 100000) {
            const diskon = totalHarga * 0.1;
            totalHarga -= diskon;
            $('#cartTotal').html(`
                <small style="text-decoration:line-through;color:var(--text-muted);font-size:0.8rem;">Rp ${(totalHarga + diskon).toLocaleString('id-ID')}</small>
                <br>Rp ${totalHarga.toLocaleString('id-ID')}
            `);
        } else {
            $('#cartTotal').text('Rp ' + totalHarga.toLocaleString('id-ID'));
        }
    }

    $(document).on('click', '.qty-btn', function() {
        const action = $(this).data('action');
        const id = $(this).data('id');
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (action === 'plus') item.qty += 1;
        else if (action === 'minus') {
            item.qty -= 1;
            if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        }
        updateCartUI();
    });

    $(document).on('click', '.cart-item-remove', function() {
        const id = $(this).data('id');
        const item = cart.find(i => i.id === id);
        if (item) {
            showToast(`${item.icon} ${item.nama} dihapus`);
            cart = cart.filter(i => i.id !== id);
            updateCartUI();
        }
    });

    $('#cartBtn').click(function() { $('#cartSidebar').addClass('open'); $('#cartOverlay').fadeIn(300); });
    $('#cartClose, #cartOverlay').click(function() { $('#cartSidebar').removeClass('open'); $('#cartOverlay').fadeOut(300); });

    $('#btnCheckout').click(function() {
        if (cart.length === 0) { showToast('❌ Keranjang masih kosong!'); return; }
        
        const total = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const $btn = $(this);$btn.html('<i class="fas fa-spinner fa-spin"></i> Memproses...').prop('disabled', true);
        
        setTimeout(function() {
            $btn.html('<i class="fas fa-check-circle"></i> Checkout Sekarang').prop('disabled', false);
            cart = [];
            updateCartUI();
            $('#cartSidebar').removeClass('open');
            $('#cartOverlay').fadeOut(300);
            showToast(`Checkout berhasil! ${totalQty} item diproses`);
        }, 1500);
    });

    let toastTimer;
    function showToast(message) {
        clearTimeout(toastTimer);
        $('#toastMsg').text(message);
        $('#toast').addClass('show');
        toastTimer = setTimeout(function() { $('#toast').removeClass('show'); }, 2500);
    }

    $('#hamburger').click(function() {
        $('#navMenu').toggleClass('show');
        const icon = $(this).find('i');
        if ($('#navMenu').hasClass('show')) icon.removeClass('fa-bars').addClass('fa-times');
        else icon.removeClass('fa-times').addClass('fa-bars');
    });

    $('.nav-link').click(function() {
        if (window.innerWidth <= 768) {
            $('#navMenu').removeClass('show');
            $('#hamburger').find('i').removeClass('fa-times').addClass('fa-bars');
        }
    });

    renderProduk();
    updateCartUI();
});
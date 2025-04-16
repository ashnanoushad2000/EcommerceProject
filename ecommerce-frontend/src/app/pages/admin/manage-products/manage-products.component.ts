import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  productForm!: FormGroup;
  isEditMode = false;
  showModal = false;

  searchText: string = '';
  selectedCategory: string = 'All';
  categories: string[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
      },
      error: (err: any) => console.error('❌ Failed to load products', err)
    });
  }

  // ✅ FIXED: Removed 'All' from the categories array
  extractCategories(): void {
    const unique = new Set(this.products.map(p => p.category));
    this.categories = Array.from(unique); // Only unique categories
  }

  filterProducts(): void {
    const term = this.searchText.toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      const matchesName = product.name.toLowerCase().includes(term);
      const matchesCategory =
        this.selectedCategory === 'All' || product.category === this.selectedCategory;
      return matchesName && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== productId);
          this.filterProducts();
        },
        error: (err) => console.error('❌ Failed to delete product:', err)
      });
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.productForm.reset();
    this.showModal = true;
  }

  openEditModal(product: any): void {
    this.isEditMode = true;
    this.productForm.patchValue(product);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formData = this.productForm.value;

    if (this.isEditMode) {
      this.productService.updateProduct(formData.id, formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          alert('✅ Product updated!');
        },
        error: (err) => console.error('❌ Update failed', err)
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          alert('✅ Product added!');
        },
        error: (err) => console.error('❌ Creation failed', err)
      });
    }
  }
}

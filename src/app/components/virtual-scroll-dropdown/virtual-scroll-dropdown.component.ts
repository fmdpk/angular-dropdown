import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-virtual-scroll-dropdown',
  templateUrl: './virtual-scroll-dropdown.component.html',
  styleUrls: ['./virtual-scroll-dropdown.component.scss'],
})
export class VirtualScrollDropdownComponent {
  items: any[] = []; // Data currently visible in the viewport
  allItems: any[] = []; // Full dataset fetched from the server (simulate backend)
  selectedItem: any = null; // Selected item
  isDropdownOpen = false; // Dropdown open/close state
  loading = false; // Flag to display the loading spinner
  itemSize = 40; // Height of each item in pixels for virtual scrolling
  totalCount = 1000; // Total number of items on the server (simulate backend)
  batchSize = 20; // Number of items to load per lazy load request
  fetchedCount = 0; // The number of items fetched so far

  constructor() {
    // Simulate a backend with 1000 items
    this.allItems = Array.from({ length: this.totalCount }).map((_, i) => ({
      label: `Item ${i}`,
      value: i,
    }));

    // Initial fetch of items (lazy load the first batch)
    this.loadMoreItems();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onScroll(index: any) {
    // Trigger lazy loading when scrolling near the end of the currently fetched data
    if (index >= this.items.length - this.batchSize / 2 && !this.loading) {
      this.loadMoreItems();
    }
  }

  loadMoreItems() {
    if (this.fetchedCount >= this.totalCount) return; // Stop fetching if all items are loaded

    this.loading = true;

    // Simulate async data fetching (e.g., API call)
    setTimeout(() => {
      const nextBatch = this.allItems.slice(
        this.fetchedCount,
        this.fetchedCount + this.batchSize
      );
      this.items = [...this.items, ...nextBatch];
      this.fetchedCount += nextBatch.length;
      this.loading = false;
    }, 1000); // Simulated 1-second delay for fetching data
  }

  selectItem(item: any) {
    this.selectedItem = item;
    this.isDropdownOpen = false;
  }
}

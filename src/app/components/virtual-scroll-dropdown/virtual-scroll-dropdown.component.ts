import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-virtual-scroll-dropdown',
  templateUrl: './virtual-scroll-dropdown.component.html',
  styleUrls: ['./virtual-scroll-dropdown.component.scss'],
})
export class VirtualScrollDropdownComponent {
  @Input('group') group: boolean = false;
  @Input('multiple') multiple: boolean = true;

  items: any[] = []; // Data currently visible in the viewport
  allItems: any[] = []; // Full dataset fetched from the server (simulate backend)
  selectedItem: any = null; // Selected item
  selectedItems: any[] = []; // Selected item
  isDropdownOpen = false; // Dropdown open/close state
  loading = false; // Flag to display the loading spinner
  itemSize = 40; // Height of each item in pixels for virtual scrolling
  totalCount = 1000; // Total number of items on the server (simulate backend)
  batchSize = 20; // Number of items to load per lazy load request
  fetchedCount = 0; // The number of items fetched so far
  searchTerm: string = ''; // Input value for filtering
  filteredItems: any[] = []; // Filtered view of items
  groupedItems: any[] = [];
  dataFetchCount = 0;
  fetchedPages: number[] = [];

  constructor() {
    // Simulate a backend with 1000 items
    this.allItems = Array.from({ length: this.totalCount }).map((_, i) => ({
      label: `Item ${i}`,
      value: i,
      isSelected: false,
    }));

    // Initial fetch and grouping of items
    this.loadMoreItems();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onScroll(index: any) {
    if (index >= this.items.length - this.batchSize / 2 && !this.loading) {
      this.loadMoreItems(); // Trigger lazy loading when scrolling near the end
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
      this.dataFetchCount = this.dataFetchCount + 1;
      this.fetchedPages.push(this.dataFetchCount);
      this.loading = false;
      this.onFilterChange();
    }, 1000); // Simulated 1-second delay for fetching data
  }

  onFilterChange() {
    if (!this.group) {
      this.filteredItems = this.items.filter((item) =>
        item.label.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.group) {
      const filtered = this.items.filter((item) =>
        item.label.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.groupItems(filtered);
    }
  }

  groupItems(items: any[]) {
    this.groupedItems = [];
    this.fetchedPages.forEach((item) => {
      let slice = items.slice(
        (item - 1) * this.batchSize,
        this.batchSize * item
      );

      const grouped = slice.reduce((groups, sliceItem) => {
        let groupKey = 'group-' + item;

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(sliceItem);
        return groups;
      }, {});

      Object.keys(grouped).map((key) =>
        this.groupedItems.push({
          header: key,
          items: grouped[key],
        })
      );
    });
  }

  selectItem(item: any) {
    if (this.selectedItem) {
      this.unSelectPreviousItem();
    }
    item.isSelected = true;
    this.selectedItem = item;
    this.isDropdownOpen = false;
  }

  selectMultipleItem(item: any, event: any) {
    if (this.loading) {
      return;
    }
    event.preventDefault();
    item.isSelected = !item.isSelected;
    if (item.isSelected) {
      let flag = this.selectedItems.find(
        (element) => item.value === element.value
      );
      if (!flag) {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems = this.selectedItems.filter(
        (element) => element.value !== item.value
      );
    }
    console.log(item);
    console.log(this.selectedItems);
  }

  unSelectPreviousItem() {
    let index = this.items.findIndex(
      (elem) => this.selectedItem.value === elem.value
    );
    this.items[index].isSelected = false;
  }

  clearSelection(event: MouseEvent) {
    event.stopPropagation(); // Prevent closing the dropdown
    this.unSelectPreviousItem();
    this.selectedItem = null;
  }

  removeItem(item: any) {
    this.selectedItems = this.selectedItems.filter(
      (element) => element.value !== item.value
    );
    this.items[item.value].isSelected = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest(
      '.dropdown-container'
    );
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}

# Assignment #6: jQuery (Selectors, Effects, Animations)

**Student:** Aitpayev Tamerlan  
**Group:** IT-2510  
**Course:** Web Technologies (Front-End Development)  
**Instructor:** Abitova G.A.  
**Institution:** Astana IT University  

---

## Project Structure

- [`index.html`](index.html) — Assignment hub and overview page.
- [`task1.html`](task1.html) & [`task1.js`](task1.js) — **Task 1: Selector Detective**. Rebuilds the 2-floor, 4-room birthday party (`19:30 – 22:30`) of 21 guests from an in-memory array using jQuery and solves all 20 investigation cases (identifying **Zarina** as the cake thief) with a single jQuery selector/traversal chain per case, single-jump `animate()`, and `fadeIn()` / `fadeOut()` party changes.
- [`task2.html`](task2.html) & [`task2.js`](task2.js) — **Task 2: The Party in Motion**. Copy of Task 1 extended with four interactive jQuery effects:
  1. **Spotlight (`fadeTo`)**: Fades non-matching guests to `20%` opacity in `0.3s` (`fadeTo(300, 0.2)`) and restores all guests with the **Clear** button.
  2. **Morphing Guest Card**: Starts small on the clicked guest's avatar photo using `offset()` and grows to full size via `animate()`, showing all guest data in words. Closes on `Esc` or outside click by shrinking back into the photo.
  3. **Move Across the House**: Flies a guest's card across rooms via `clone()`, `offset()`, and `animate()`, slowly closing the gap in the old room and opening a slot at the end of the new room while updating the underlying array for Task 1 cases.
  4. **Sort by Time & Fast-Click Safety**: Smoothly slides cards into chronological order (`earliest → latest`) and back to the original picture order using `position()` and `animate()`, protected against rapid clicking queues with `.stop(true, false)`.
- [`style.css`](style.css) — Custom architectural styling with **zero** CSS transitions and **zero** CSS animations (strict compliance with Rule #5).
- [`Assignment6_Aitpayev_Tamerlan.docx`](Assignment6_Aitpayev_Tamerlan.docx) — Full laboratory report with screenshots of all 20 cases and Task 2 checks, tables, jQuery chains, and explanations.

---

## Summary of All 20 Detective Cases (Task 1)

| Case | Question / Task | Single jQuery Chain | Result |
| :--- | :--- | :--- | :--- |
| **1** | Who is in the hall? | `$('#room-hall .guest-card')` | **6 guests:** Arman, Sophia, Dias, Bekzat, Aruzhan, Saule |
| **2** | Who is dressed in yellow or purple? | `$('.guest-card.color-yellow, .guest-card.color-purple')` | **8 guests:** Aigerim, Madina, Sophia, Bekzat, Emma, Yerlan, Zarina, Inkar |
| **3** | Which AITU students are upstairs? | `$('#floor-2 .guest-card.is-aitu')` | **4 guests:** Aigerim, Aliya, Bekzat, Aruzhan |
| **4** | Who has glasses or a bag? | `$('.guest-card:has(.thing-glasses, .thing-bag)')` | **14 guests:** Aigerim, Madina, Ivan, Arman, Bekzat, Saule, Nurlan, Emma, Timur, Yerlan, Kamila, Daniel, Zarina, Inkar |
| **5** | Who came with nothing at all? | `$('.guest-card:not(:has(.thing-icon))')` | **3 guests:** Dias, Sergey, Natasha |
| **6** | Who has a phone but no bag? | `$('.guest-card:has(.thing-phone):not(:has(.thing-bag))')` | **5 guests:** Aliya, Sophia, Aruzhan, Yerlan, Askar |
| **7** | Who arrived between 20:30 and 21:00, both times included? | `$('.guest-card').filter((_, el) => $(el).attr('data-time') >= '20:30' && $(el).attr('data-time') <= '21:00')` | **6 guests:** Aigerim, Arman, Bekzat, Sergey, Natasha, Askar |
| **8** | Who arrived after 21:00 and is not an AITU student? | `$('.guest-card:not(.is-aitu)').filter((_, el) => $(el).attr('data-time') > '21:00')` | **6 guests:** Madina, Sophia, Saule, Timur, Yerlan, Zarina |
| **9** | Who stands right next to Askar? | `$('.guest-card[data-name="Askar"]').prev().add($('.guest-card[data-name="Askar"]').next())` | **2 guests:** Natasha, Inkar |
| **10** | Who stands last in each room? | `$('.room .guest-card:last-child')` | **4 guests:** Ivan, Saule, Kamila, Inkar |
| **11** | Who stands third in each room? | `$('.room .guest-card:nth-child(3)')` | **4 guests:** Madina, Dias, Timur, Natasha |
| **12** | Who stands after Timur in his room? | `$('.guest-card[data-name="Timur"]').nextAll()` | **3 guests:** Sergey, Yerlan, Kamila |
| **13** | Who stands right before someone in black? | `$('.guest-card.color-black').prev()` | **3 guests:** Madina, Timur, Natasha |
| **14** | In which room is Aruzhan? | `$('.guest-card[data-name="Aruzhan"]').closest('.room')` | **1 room:** Hall |
| **15** | Which rooms have fewer than 6 guests? | `$('.room:not(:has(.guest-card:nth-child(6)))')` | **2 rooms:** Balcony, Living room |
| **16** | In which rooms does somebody have a cup, but nobody wears glasses? | `$('.room:has(.thing-cup):not(:has(.thing-glasses))')` | **1 room:** Balcony |
| **17** | Who came first to each room? | `$('.guest-card').filter((_, el) => $(el).siblings().filter((_, s) => $(s).attr('data-time') < $(el).attr('data-time')).length === 0)` | **4 guests:** Ivan, Dias, Nurlan, Daniel |
| **18** | Miras, an AITU student in blue, comes at 21:20 with his phone and joins Askar and Inkar, standing between them. Let him appear smoothly. | `createGuestCardElement({name:'Miras',color:'blue',time:'21:20',aitu:true,things:['phone']},'living-room',1).hide().insertAfter('.guest-card[data-name="Askar"]').fadeIn(400)` | **Added 1 guest:** Miras |
| **19** | Natasha says goodbye and goes home. Her card fades away and disappears from the page. | `$('.guest-card[data-name="Natasha"]').fadeOut(400, function() { $(this).remove(); })` | **Removed 1 guest:** Natasha |
| **20** | **Who took the cake?** Downstairs, came after 21:00 but before 21:30, has crumbs but no cup, and stood right next to an AITU student. | `$('#floor-1 .guest-card:has(.thing-crumbs):not(:has(.thing-cup))').filter((_, el) => $(el).attr('data-time') > '21:00' && $(el).attr('data-time') < '21:30' && $(el).prev().add($(el).next()).is('.is-aitu'))` | **THIEF IDENTIFIED: Zarina** |

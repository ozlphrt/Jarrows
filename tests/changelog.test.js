import { describe, it, expect } from 'vitest';
import { changelog, getChangelogForVersion } from '../src/changelog.js';

describe('changelog module', () => {
    it('should contain v8.35.0 entry', () => {
        expect(changelog['8.35.0']).toBeDefined();
        expect(changelog['8.35.0'].changes.length).toBeGreaterThan(0);
    });

    it('should contain v8.33.0 entry', () => {
        expect(changelog['8.33.0']).toBeDefined();
        expect(changelog['8.33.0'].changes.length).toBeGreaterThan(0);
    });

    it('should retrieve changelog for known version', () => {
        const entry = getChangelogForVersion('8.33.0');
        expect(entry).toBeDefined();
        expect(entry.title).toContain('Unified');
    });

    it('should return null or fallback for non-existent version', () => {
        const entry = getChangelogForVersion('999.999.999');
        expect(entry).toBeNull();
    });
});
